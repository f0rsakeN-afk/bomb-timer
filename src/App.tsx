import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ak47 from './assets/AK47_Fire1.wav';
import explode from './assets/explode.wav';
import beep from './assets/beep.wav';
import doubleBeep from './assets/doublebeep.wav';
import arm from './assets/armbomb.wav';


const App = () => {
  const [time, setTime] = useState({ minutes: 45, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [inputMode, setInputMode] = useState(false);
  const [inputValue, setInputValue] = useState("02:00");

  const playAudio = (audioFile: string) => {
    const audio = new Audio(audioFile);
    audio.volume = 1;
    audio.play().catch(console.error);
  }

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>

    if (isRunning) {
      playAudio(ak47);

      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime.minutes === 0 && prevTime.seconds === 0) {
            setIsRunning(false);
            playAudio(explode);
            return prevTime;
          }

          if (prevTime.minutes === 0 && prevTime.seconds <= 59 && prevTime.seconds >= 11) {
            playAudio(beep);
          }

          if (prevTime.minutes === 0 && prevTime.seconds <= 10) {
            playAudio(doubleBeep);
          }

          if (prevTime.seconds === 0) {
            return {
              minutes: prevTime.minutes - 1,
              seconds: 59,
            };
          }

          return {
            minutes: prevTime.minutes,
            seconds: prevTime.seconds - 1,
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Space") {
      e.preventDefault();
      setIsRunning((prev) => !prev);
    } else if (e.code === "Tab") {
      e.preventDefault();
      if (!isRunning) {
        setTime({ minutes: 45, seconds: 0 });
        setInputValue("45:00");
      }
    } else if (e.code === "Escape") {
      window.close();
    } else if (!isRunning && !inputMode && /^[0-9]$/.test(e.key)) {
      setInputMode(true);
      setInputValue(e.key);
    } else if (inputMode) {
      if (/^[0-9]$/.test(e.key)) {
        setInputValue((prev) => {
          let newValue = prev;
          if (prev.includes(":")) {
            const [mins, secs] = prev.split(":");
            if (secs.length < 2) {
              newValue = `${mins}:${secs}${e.key}`;
              const seconds = parseInt(secs + e.key);
              if (seconds > 59) return prev;
            }
          } else {
            if (prev.length < 2) {
              newValue = prev + e.key;
            }
            if (newValue.length === 2) {
              newValue += ":";
            }
          }
          return newValue;
        });
      } else if (e.code === "Backspace") {
        setInputValue((prev) => {
          if (prev.length === 3) return prev.slice(0, 2);
          if (prev === "0") return "00:00";
          return prev.slice(0, -1) || "00:00";
        });
      } else if (e.code === "Enter") {
        const [min, sec] = inputValue.split(":").map(Number);
        if (!isNaN(min) && !isNaN(sec) && sec < 60) {
          const formattedMin = String(min).padStart(2, "0");
          const formattedSec = String(sec).padStart(2, "0");
          setTime({ minutes: min, seconds: sec });
          setInputValue(`${formattedMin}:${formattedSec}`);

          // Only play arm sound if the input is complete (XX:XX format)
          if (inputValue.includes(":") && inputValue.length === 5) {
            playAudio(arm);
          }
        }
        setInputMode(false);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRunning, inputMode, inputValue]);

  const displayTime = `${String(time.minutes).padStart(2, "0")}:${String(
    time.seconds
  ).padStart(2, "0")}`;

  return (
    <motion.div
      className="timer-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={inputMode ? "input" : "display"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="timer-display"
        >
          <div className="timer-bg">{inputMode ? inputValue : displayTime}</div>
          <div className="timer">{inputMode ? inputValue : displayTime}</div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export default App;