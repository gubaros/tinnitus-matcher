import React, { useState, useEffect } from 'react';
import './App.css';

const App: React.FC = () => {
  const [frequency, setFrequency] = useState(440); // Default frequency set to 440Hz (A4)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [oscillator, setOscillator] = useState<OscillatorNode | null>(null);

  useEffect(() => {
    if (!audioContext) {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(context);
      const osc = context.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, context.currentTime);
      osc.connect(context.destination);
      osc.start();
      setOscillator(osc);
    }
  }, [audioContext]);

  useEffect(() => {
    if (oscillator) {
      oscillator.frequency.setValueAtTime(frequency, audioContext!.currentTime);
    }
  }, [frequency, oscillator, audioContext]);

  const handleFrequencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFrequency(Number(event.target.value));
  };

  const startAudio = () => {
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
  };

  return (
    <div className="App">
      <h1>Tinnitus Matcher</h1>
      <button onClick={startAudio}>Start Audio</button>
      <input
        type="range"
        min="20"
        max="20000"
        value={frequency}
        onChange={handleFrequencyChange}
      />
      <p>Frequency: {frequency} Hz</p>
    </div>
  );
};

export default App;
