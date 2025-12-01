import { useCallback, useRef } from 'react';

export const useSoundFeedback = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, volume: number = 0.15) => {
    try {
      const audioContext = getAudioContext();
      
      // Create oscillator for the tone
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Configure tone
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      // Configure volume envelope (fade in and out)
      const now = audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(volume, now + 0.01);
      gainNode.gain.linearRampToValueAtTime(volume, now + duration - 0.05);
      gainNode.gain.linearRampToValueAtTime(0, now + duration);
      
      // Play the tone
      oscillator.start(now);
      oscillator.stop(now + duration);
    } catch (error) {
      console.warn('Sound feedback error:', error);
    }
  }, [getAudioContext]);

  const playChord = useCallback((frequencies: number[], duration: number, volume: number = 0.1) => {
    frequencies.forEach(freq => playTone(freq, duration, volume));
  }, [playTone]);

  const playNext = useCallback(() => {
    // Ascending chord for moving forward
    playChord([523.25, 659.25], 0.15, 0.08);
  }, [playChord]);

  const playBack = useCallback(() => {
    // Descending chord for going back
    playChord([659.25, 523.25], 0.15, 0.08);
  }, [playChord]);

  const playSelect = useCallback(() => {
    // Single pleasant tone for selection
    playTone(783.99, 0.1, 0.1);
  }, [playTone]);

  const playSubmit = useCallback(() => {
    // Success chord for form submission
    const audioContext = getAudioContext();
    const now = audioContext.currentTime;
    
    playTone(523.25, 0.12, 0.08);
    setTimeout(() => playTone(659.25, 0.12, 0.08), 50);
    setTimeout(() => playTone(783.99, 0.2, 0.1), 100);
  }, [playTone, getAudioContext]);

  const playHover = useCallback(() => {
    // Very subtle tone for hover
    playTone(880, 0.05, 0.05);
  }, [playTone]);

  return {
    playNext,
    playBack,
    playSelect,
    playSubmit,
    playHover,
  };
};
