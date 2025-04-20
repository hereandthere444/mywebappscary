import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [level, setLevel] = useState('normal');
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showGhost, setShowGhost] = useState(false);
  const [reactionTime, setReactionTime] = useState(null);
  const [isWaitingForBeep, setIsWaitingForBeep] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const beepAudioRef = useRef(null);
  const scaryAudioRef = useRef(null);

  // Preload audio files
  useEffect(() => {
    beepAudioRef.current = new Audio('/beep.mp3');
    scaryAudioRef.current = new Audio('/scary.mp3');
    scaryAudioRef.current.volume = 1.0;

    // Preload by playing and immediately pausing
    beepAudioRef.current.play().then(() => {
      beepAudioRef.current.pause();
      beepAudioRef.current.currentTime = 0;
    }).catch(e => console.log('Audio preload error:', e));

    scaryAudioRef.current.play().then(() => {
      scaryAudioRef.current.pause();
      scaryAudioRef.current.currentTime = 0;
    }).catch(e => console.log('Audio preload error:', e));
  }, []);

  const startGame = () => {
    setIsWaitingForBeep(true);
    setTimer(0);
    setReactionTime(null);
    
    if (level === 'pro') {
      // Show ghost after a random delay between 1-3 seconds
      const ghostDelay = Math.random() * 2000 + 1000;
      setTimeout(() => {
        // Play scary sound first
        playScarySound();
        // Show ghost after 200ms delay
        setTimeout(() => {
          setShowGhost(true);
          setTimeout(() => {
            setShowGhost(false);
            setIsWaitingForBeep(false);
          }, 1500);
        }, 200);
      }, ghostDelay);
    } else {
      // For normal and good levels, wait 2-5 seconds before beep
      const beepDelay = Math.random() * 3000 + 2000;
      setTimeout(() => {
        // Play beep first, then start timer after a brief delay
        playBeepSound();
        setTimeout(() => {
          startTimer();
        }, 150); // Increased delay to 150ms to better sync with audio
      }, beepDelay);
    }
  };

  const startTimer = () => {
    setIsWaitingForBeep(false);
    setIsRunning(true);
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setTimer((Date.now() - startTimeRef.current) / 1000);
    }, 10);
  };

  const stopTimer = () => {
    if (isRunning) {
      clearInterval(timerRef.current);
      setIsRunning(false);
      setReactionTime(timer);
    }
  };

  const playBeepSound = () => {
    if (beepAudioRef.current) {
      beepAudioRef.current.currentTime = 0;
      beepAudioRef.current.play();
    }
  };

  const playScarySound = () => {
    if (scaryAudioRef.current) {
      scaryAudioRef.current.currentTime = 0;
      scaryAudioRef.current.play();
    }
  };

  const getLevelDetails = () => {
    switch (level) {
      case 'normal':
        return { target: 1.0, color: 'green' };
      case 'good':
        return { target: 0.5, color: 'blue' };
      case 'pro':
        return { target: 0.3, color: 'red' };
      default:
        return { target: 1.0, color: 'green' };
    }
  };

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
      <h1>Reaction Time Challenge</h1>
      <div className="level-selector">
        <button 
          className={level === 'normal' ? 'active' : ''} 
          onClick={() => setLevel('normal')}
        >
          Normal
        </button>
        <button 
          className={level === 'good' ? 'active' : ''} 
          onClick={() => setLevel('good')}
        >
          Good
        </button>
        <button 
          className={level === 'pro' ? 'active' : ''} 
          onClick={() => setLevel('pro')}
        >
          Expert
        </button>
      </div>

      <div className="game-area">
        {showGhost && (
          <div className="ghost-image">
            <img src="/ghost.png" alt="Scary Ghost" />
          </div>
        )}
        
        <div className="timer" style={{ color: getLevelDetails().color }}>
          {timer.toFixed(3)}s
        </div>

        {!isRunning && !isWaitingForBeep ? (
          <button onClick={startGame}>Start Game</button>
        ) : (
          <button onClick={stopTimer}>Stop</button>
        )}

        {isWaitingForBeep && (
          <p className="waiting">Wait for the beep sound...</p>
        )}

        {reactionTime !== null && (
          <div className="result">
            <p>Your reaction time: {reactionTime.toFixed(3)}s</p>
            <p>Target time: {getLevelDetails().target}s</p>
            {reactionTime <= getLevelDetails().target ? (
              <p className="success">Success! 🎉</p>
            ) : (
              <p className="fail">Too slow! Try again!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App; 