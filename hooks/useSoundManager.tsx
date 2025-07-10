// hooks/useSoundManager.tsx
import { useEffect, useRef } from 'react';
import { Howl, Howler } from 'howler';
import { useAppStore } from '@/store/useAppStore';

interface SoundConfig {
  [key: string]: {
    src: string[];
    volume?: number;
    loop?: boolean;
    sprite?: { [key: string]: [number, number] };
  };
}

const soundConfig: SoundConfig = {
  // UI Sounds
  click: {
    src: ['/sounds/click.mp3'],
    volume: 0.3,
  },
  hover: {
    src: ['/sounds/hover.mp3'],
    volume: 0.2,
  },
  success: {
    src: ['/sounds/success.mp3'],
    volume: 0.5,
  },
  error: {
    src: ['/sounds/error.mp3'],
    volume: 0.5,
  },
  notification: {
    src: ['/sounds/notification.mp3'],
    volume: 0.6,
  },
  
  // Quiz Sounds
  correct: {
    src: ['/sounds/correct.mp3'],
    volume: 0.4,
  },
  incorrect: {
    src: ['/sounds/incorrect.mp3'],
    volume: 0.4,
  },
  complete: {
    src: ['/sounds/complete.mp3'],
    volume: 0.6,
  },
  
  // Achievement Sounds
  achievement: {
    src: ['/sounds/achievement.mp3'],
    volume: 0.7,
  },
  levelUp: {
    src: ['/sounds/level-up.mp3'],
    volume: 0.7,
  },
  
  // Emergency Simulation Sounds
  alarm: {
    src: ['/sounds/alarm.mp3'],
    volume: 0.3,
    loop: true,
  },
  heartbeat: {
    src: ['/sounds/heartbeat.mp3'],
    volume: 0.5,
    loop: true,
  },
  flatline: {
    src: ['/sounds/flatline.mp3'],
    volume: 0.6,
  },
  
  // Background Music
  ambient: {
    src: ['/sounds/ambient.mp3'],
    volume: 0.1,
    loop: true,
  },
  studyMusic: {
    src: ['/sounds/study-music.mp3'],
    volume: 0.15,
    loop: true,
  },
};

export function useSoundManager() {
  const soundEnabled = useAppStore(state => state.preferences.soundEnabled);
  const sounds = useRef<{ [key: string]: Howl }>({});
  const currentMusic = useRef<Howl | null>(null);
  
  useEffect(() => {
    // Preload sounds
    Object.entries(soundConfig).forEach(([key, config]) => {
      sounds.current[key] = new Howl({
        ...config,
        preload: true,
      });
    });
    
    // Set global volume based on sound enabled state
    Howler.volume(soundEnabled ? 1 : 0);
    
    return () => {
      // Cleanup all sounds
      Object.values(sounds.current).forEach(sound => {
        sound.unload();
      });
    };
  }, []);
  
  useEffect(() => {
    // Update global volume when sound setting changes
    Howler.volume(soundEnabled ? 1 : 0);
  }, [soundEnabled]);
  
  const playSound = (soundName: string, options?: { volume?: number; rate?: number }) => {
    if (!soundEnabled) return;
    
    const sound = sounds.current[soundName];
    if (!sound) {
      console.warn(`Sound "${soundName}" not found`);
      return;
    }
    
    if (options?.volume) {
      sound.volume(options.volume);
    }
    
    if (options?.rate) {
      sound.rate(options.rate);
    }
    
    const id = sound.play();
    
    // Reset to original settings after playing
    sound.once('end', () => {
      if (soundConfig[soundName].volume) {
        sound.volume(soundConfig[soundName].volume);
      }
      sound.rate(1);
    });
    
    return id;
  };
  
  const stopSound = (soundName: string, fadeOut?: number) => {
    const sound = sounds.current[soundName];
    if (!sound) return;
    
    if (fadeOut) {
      sound.fade(sound.volume(), 0, fadeOut);
      setTimeout(() => sound.stop(), fadeOut);
    } else {
      sound.stop();
    }
  };
  
  const playMusic = (musicName: string, fadeIn?: number) => {
    if (!soundEnabled) return;
    
    // Stop current music if playing
    if (currentMusic.current) {
      currentMusic.current.fade(currentMusic.current.volume(), 0, fadeIn || 1000);
      setTimeout(() => currentMusic.current?.stop(), fadeIn || 1000);
    }
    
    const music = sounds.current[musicName];
    if (!music) return;
    
    currentMusic.current = music;
    
    if (fadeIn) {
      music.volume(0);
      music.play();
      music.fade(0, soundConfig[musicName].volume || 0.1, fadeIn);
    } else {
      music.play();
    }
  };
  
  const stopMusic = (fadeOut?: number) => {
    if (!currentMusic.current) return;
    
    if (fadeOut) {
      currentMusic.current.fade(currentMusic.current.volume(), 0, fadeOut);
      setTimeout(() => {
        currentMusic.current?.stop();
        currentMusic.current = null;
      }, fadeOut);
    } else {
      currentMusic.current.stop();
      currentMusic.current = null;
    }
  };
  
  const setMusicVolume = (volume: number) => {
    if (currentMusic.current) {
      currentMusic.current.volume(volume);
    }
  };
  
  const playButtonSound = () => playSound('click');
  const playHoverSound = () => playSound('hover', { volume: 0.1 });
  const playSuccessSound = () => playSound('success');
  const playErrorSound = () => playSound('error');
  const playNotificationSound = () => playSound('notification');
  
  return {
    playSound,
    stopSound,
    playMusic,
    stopMusic,
    setMusicVolume,
    playButtonSound,
    playHoverSound,
    playSuccessSound,
    playErrorSound,
    playNotificationSound,
  };
}

// Create a singleton instance for global use
let soundManagerInstance: ReturnType<typeof useSoundManager> | null = null;

export function getSoundManager() {
  if (!soundManagerInstance) {
    console.warn('Sound manager not initialized');
  }
  return soundManagerInstance;
}

export function SoundManagerProvider({ children }: { children: React.ReactNode }) {
  const soundManager = useSoundManager();
  
  useEffect(() => {
    soundManagerInstance = soundManager;
    return () => {
      soundManagerInstance = null;
    };
  }, [soundManager]);
  
  return <>{children}</>;
}