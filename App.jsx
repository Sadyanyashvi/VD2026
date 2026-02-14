import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";

import { story } from "./data/story";
import StorySlide from "./components/StorySlide";
import Quiz from "./components/Quiz";
import HeartDoor from "./components/HeartDoor";
import ProgressBar from "./components/ProgressBar";
import FinalMessage from "./components/FinalMessage";
import useAudio from "./hooks/useAudio";

import music from "./assets/music.mp3";

export default function App() {
  const [page, setPage] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState([]);

  // HEART CURSOR TRACKING + TRAIL
  useEffect(() => {
    const move = (e) => {
      setCursor({ x: e.clientX, y: e.clientY });
      setTrail((prev) => [...prev.slice(-5), { x: e.clientX, y: e.clientY }]);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const audioRef = useAudio(music);
  const totalPages = story.length + 3;

  const triggerConfetti = () => {
    setConfetti(true);
    setTimeout(() => setConfetti(false), 4000);
  };

  // FLOATING HEARTS/ROSES WITH PARALLAX
  const floatingHearts = [...Array(25)].map((_, i) => (
    <motion.div
      key={i}
      className={`floating-heart layer${(i % 3) + 1}`}
      style={{
        left: `${Math.random() * 100}%`,
        color: i % 2 === 0 ? "#FF4D4D" : "#FF69B4",
        animationDelay: i * 0.5 + "s",
      }}
    >
      {i % 2 === 0 ? "💖" : "🌹"}
    </motion.div>
  ));

  // CURSOR TRAIL
  const trailHearts = trail.map((t, i) => (
    <div
      key={i}
      className="cursor-trail"
      style={{ left: t.x - 10, top: t.y - 10 }}
    >
      {i % 2 === 0 ? "💖" : "🌹"}
    </div>
  ));

  return (
    <div style={container}>
      {floatingHearts}
      {trailHearts}

      {/* HEART CURSOR */}
      <motion.div
        className="cursor-heart"
        animate={{ x: cursor.x - 18, y: cursor.y - 18 }}
      >
        ❤️
      </motion.div>

      <audio ref={audioRef} src={music} loop autoPlay />

      <ProgressBar page={page} total={totalPages} />

      {confetti && (
        <Confetti
          gravity={0.15}
          numberOfPieces={150}
          colors={["#FFD700", "#FF69B4", "#FFFFFF"]}
        />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 1 }}
        >
          {page < story.length && <StorySlide {...story[page]} />}
          {page === story.length && <Quiz onCorrect={triggerConfetti} />}
          {page === story.length + 1 && <HeartDoor onUnlock={triggerConfetti} />}
          {page === story.length + 2 && <FinalMessage onCelebrate={triggerConfetti} />}
        </motion.div>
      </AnimatePresence>

      <div style={nav}>
        {page > 0 && <button onClick={() => setPage(page - 1)}>Previous</button>}
        {page < totalPages - 1 && <button onClick={() => setPage(page + 1)}>Next</button>}
      </div>
    </div>
  );
}

const container = {
  height: "100vh",
  width: "100vw",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
};

const nav = {
  position: "absolute",
  bottom: 30,
  display: "flex",
  gap: 20,
};
