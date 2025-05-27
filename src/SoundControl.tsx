import React, { useState, useEffect } from 'react';
import { audioContext } from './lib/global';

// Create a global audio context

export function SoundControl() {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Get the initial mute state from localStorage
    const savedMuteState = localStorage.getItem('isMuted');
    if (savedMuteState) {
      const muted = savedMuteState === 'true';
      setIsMuted(muted);
      audioContext.setMuted(muted);
    }
  }, []);

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    localStorage.setItem('isMuted', String(newMuteState));
    audioContext.setMuted(newMuteState);
  };

  return (
    <button
      onClick={toggleMute}
      className="fixed bottom-4 right-4 z-50 p-3 max-w-12 max-h-12 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center" 
      style={{
        backgroundColor: '#ffc0cb',
        border: `3px solid #ff69b4`
      }}
      title={isMuted ? "Unmute" : "Mute"}
    >
      {isMuted ? '🔇' : '🔊'}
    </button>
  );
}