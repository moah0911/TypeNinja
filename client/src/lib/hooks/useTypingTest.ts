import { useState, useEffect, useCallback, KeyboardEvent, useRef } from "react";
import { getRandomText } from "@/lib/helpers/textGenerator";
import { TypingTestResult } from "@/types";
import { useSettings } from "./useSettings";

interface TypingStats {
  wpm: number;
  accuracy: number;
}

interface TypingState {
  isActive: boolean;
  mode: string;
  text: string;
  currentPosition: number;
  correctChars: number[];
  incorrectChars: number[];
  startTime: number | null;
  timeRemaining: number;
}

interface UseTypingTestProps {
  duration: number;
  onComplete: (result: TypingTestResult) => void;
}

// Types for the text cache
interface TextCache {
  [mode: string]: {
    [duration: number]: string[];
  }
}

// Audio setup - use better keyboard sounds
// Mechanical keyboard sound (short click)
const TYPING_SOUND_BASE64 = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAeHh4eHh4eHh4eHh4eHiNjY2NjY2NjY2NjY2Njaqqqqqqqqqqqqqqqqqqx8fHx8fHx8fHx8fHx8f///////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAYAAAAAAAAAAbAwjDrEAAAAAAD/+0DEAAAGBKNz9BEAJPhUrn80IAC5FGksBAIBABAKIiO5+c53tPBwMBgMBglCUJQlCQAAJQlCUJc+c/////Lnc/////+c9znPBAMBAIAwAJcUi8MpO0kwS8pc7N9szG0ITuLS4jdYgPEqRCYbLEYhKVKUo6aoYm6YJxGPQqKCdpimEw0p5HRU1NVVUEfBN0wgm6CfoqUE3qKio+jkE3KVOi1FKnKnKmqdRVOqyFRFSioqmqbYiD2KyaUkqFRZqiV/9bL/+0LEBgAIEVtp56RviQWrbD2HjfHlP1TWpUqVLU//1f/USSokDEpMjkqlTTyGRyHJJJFSipRJJ7ERLh0BAMBAMDAAMDAQDAxFNQACAYGJgADAwMQAwbOsCgBgIgBm1MASAGCSAGAaAGAKgBwEoBgYCdZ0aOXIUVf////z3957rymta1rWOuc9rWOt7QYCABn//1xAADAwEAwMBIAMDAQAwMBEAMDASADA59EAJ//6qABiqbXf/Sas1jGv+1rWtZKZxjrnGMYxrGsa5/zn/9a5z2ta7/rWta12ta//+0LEC4AKBV9l7CRvQXGrbD2HlehhADASADAwEAACAYACAAYCABgCABOe4lQADFDr3/1VVVVXet///5znOc5zv//////////////wiABioAXJkACYIgCYOoCYKYBYFABYHICYHYCgFgEwMAOTRAUwJwDl4TCGAqA+AiASAcAUAYAD/w+goALAJgKgHgGAK//////////9a1rWta1rWvOc5znOc5znP//////////////8YxjGMYxjGMYxjGMYxjGMYxrGsa//tCxA4AClVbY+wkbwlNq2v9h43xjGMYxjGMYxjnOc5znOc5znOc5zXOc5znOc5znMa5rWtYxrWtd7Wtd7Wtd7WtYxrWtYxjGMYsYxYxYxYxYAAAAAAAQAAAAAACqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqlVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tCxBUAClVbYewkbwkiquw9lI2BVVVVVVVVVVVVVVVMQQRAMCRAMBEAMDAQADASAAAAgGAgAGBgIgBgYCQAYGAlVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7QsQZgAowgWOMJG/RSjAsAYSNaVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7QsQfAAo0gV2MJGspQZBrMYSNaVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==";

// Backspace sound (slightly different)
const BACKSPACE_SOUND_BASE64 = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAeHh4eHh4eHh4eHh4eHiNjY2NjY2NjY2NjY2Njaqqqqqqqqqqqqqqqqqqx8fHx8fHx8fHx8fHx8f///////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAYAAAAAAAAAAbAwjDrEAAAAAAD/+0DEAAAGBKNz9BEAJPhUrn80IAC5FGksBAIBABAKIiO5+c53tPBwMBgMBglCUJQlCQAAJQlCUJc+c/////Lnc/////+c9znPBAMBAIAwAJcUi8MpO0kwS8pc7N9szG0ITuLS4jdYgPEqRCYbLEYhKVKUo6aoYm6YJxGPQqKCdpimEw0p5HRU1NVVUEfBN0wgm6CfoqUE3qKio+jkE3KVOi1FKnKnKmqdRVOqyFRFSioqmqbYiD2KyaUkqFRZqiV/9bL/+0LEBgAIEVtp56RviQWrbD2HjfHlP1TWpUqVLU//1f/USSokDEpMjkqlTTyGRyHJJJFSipRJJ7ERLh0BAMBAMDAAMDAQDAxFNQACAYGJgADAwMQAwbOsCgBgIgBm1MASAGCSAGAaAGAKgBwEoBgYCdZ0aOXIUVf////z3957rymta1rWOuc9rWOt7QYCABn//1xAADAwEAwMBIAMDAQAwMBEAMDASADA59EAJ//6qABiqbXf/Sas1jGv+1rWtZKZxjrnGMYxrGsa5/zn/9a5z2ta7/rWta12ta//+0LEC4AKBV9l7CRvQXGrbD2HlehhADASADAwEAACAYACAAYCABgCABOe4lQADFDr3/1VVVVXet///5znOc5zv//////////////wiABioAXJkACYIgCYOoCYKYBYFABYHICYHYCgFgEwMAOTRAUwJwDl4TCGAqA+AiASAcAUAYAD/w+goALAJgKgHgGAK//////////9a1rWta1rWvOc5znOc5znP//////////////8YxjGMYxjGMYxjGMYxjGMYxrGsa//tCxA4AClVbY+wkbwlNq2v9h43xjGMYxjGMYxjnOc5znOc5znOc5zXOc5znOc5znMa5rWtYxrWtd7Wtd7Wtd7WtYxrWtYxjGMYsYxYxYxYxYAAAAAAAQAAAAAACqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqlVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tCxBUAClVbYewkbwkiquw9lI2BVVVVVVVVVVVVVVVMQQRAMCRAMBEAMDAQADASAAAAgGAgAGBgIgBgYCQAYGAlVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7QsQZgAowgWOMJG/RSjAsAYSNaVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7QsQfAAo0gV2MJGspQZBrMYSNaVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==";

// Tab key sound (slightly different)
const TAB_SOUND_BASE64 = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAeHh4eHh4eHh4eHh4eHiNjY2NjY2NjY2NjY2Njaqqqqqqqqqqqqqqqqqqx8fHx8fHx8fHx8fHx8f///////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAYAAAAAAAAAAbAwjDrEAAAAAAD/+0DEAAAGBKNz9BEAJPhUrn80IAC5FGksBAIBABAKIiO5+c53tPBwMBgMBglCUJQlCQAAJQlCUJc+c/////Lnc/////+c9znPBAMBAIAwAJcUi8MpO0kwS8pc7N9szG0ITuLS4jdYgPEqRCYbLEYhKVKUo6aoYm6YJxGPQqKCdpimEw0p5HRU1NVVUEfBN0wgm6CfoqUE3qKio+jkE3KVOi1FKnKnKmqdRVOqyFRFSioqmqbYiD2KyaUkqFRZqiV/9bL/+0LEBgAIEVtp56RviQWrbD2HjfHlP1TWpUqVLU//1f/USSokDEpMjkqlTTyGRyHJJJFSipRJJ7ERLh0BAMBAMDAAMDAQDAxFNQACAYGJgADAwMQAwbOsCgBgIgBm1MASAGCSAGAaAGAKgBwEoBgYCdZ0aOXIUVf////z3957rymta1rWOuc9rWOt7QYCABn//1xAADAwEAwMBIAMDAQAwMBEAMDASADA59EAJ//6qABiqbXf/Sas1jGv+1rWtZKZxjrnGMYxrGsa5/zn/9a5z2ta7/rWta12ta//+0LEC4AKBV9l7CRvQXGrbD2HlehhADASADAwEAACAYACAAYCABgCABOe4lQADFDr3/1VVVVXet///5znOc5zv//////////////wiABioAXJkACYIgCYOoCYKYBYFABYHICYHYCgFgEwMAOTRAUwJwDl4TCGAqA+AiASAcAUAYAD/w+goALAJgKgHgGAK//////////9a1rWta1rWvOc5znOc5znP//////////////8YxjGMYxjGMYxjGMYxjGMYxrGsa//tCxA4AClVbY+wkbwlNq2v9h43xjGMYxjGMYxjnOc5znOc5znOc5zXOc5znOc5znMa5rWtYxrWtd7Wtd7Wtd7WtYxrWtYxjGMYsYxYxYxYxYAAAAAAAQAAAAAACqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqlVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tCxBUAClVbYewkbwkiquw9lI2BVVVVVVVVVVVVVVVMQQRAMCRAMBEAMDAQADASAAAAgGAgAGBgIgBgYCQAYGAlVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7QsQZgAowgWOMJG/RSjAsAYSNaVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7QsQfAAo0gV2MJGspQZBrMYSNaVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==";

// Audio context for better sound handling
let audioContext: AudioContext | null = null;

// Initialize audio context on first user interaction
const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Create a function that returns a new Audio object each time to avoid issues with multiple plays
const createKeySound = (keyType: 'normal' | 'backspace' | 'tab' = 'normal') => {
  // Try to initialize audio context if not already done
  try {
    initAudioContext();
  } catch (e) {
    console.log('Audio context initialization failed, falling back to Audio API');
  }
  
  // Select the appropriate sound based on key type
  let soundBase64 = TYPING_SOUND_BASE64;
  if (keyType === 'backspace') {
    soundBase64 = BACKSPACE_SOUND_BASE64;
  } else if (keyType === 'tab') {
    soundBase64 = TAB_SOUND_BASE64;
  }
  
  const sound = new Audio(soundBase64);
  sound.volume = 0.4; // Slightly lower volume
  return sound;
};

// Global text cache (shared between instances)
const textCache: TextCache = {};

// Global lock to prevent multiple concurrent text fetches that might cause text changes
const fetchLock = { isLocked: false };

// List of all available modes for preloading
const ALL_MODES = ["normal", "flirty", "developer", "typescript", "python", "java", "csharp", "go"];
const ALL_DURATIONS = [15, 30, 60, 120];

export function useTypingTest({ duration, onComplete }: UseTypingTestProps) {
  const { settings } = useSettings();
  const [typingState, setTypingState] = useState<TypingState>({
    isActive: false,
    mode: "normal",
    text: "",
    currentPosition: 0,
    correctChars: [],
    incorrectChars: [],
    startTime: null,
    timeRemaining: duration,
  });
  
  // Initialize audio on component mount to handle browser autoplay policies
  useEffect(() => {
    // Try to initialize audio context
    try {
      // Create a silent sound and play it on first user interaction
      const initSound = () => {
        initAudioContext();
        const sound = createKeySound();
        sound.volume = 0;
        sound.play().catch(e => console.log("Initial sound play failed, will retry on user interaction"));
        
        // Remove event listeners after first interaction
        document.removeEventListener('click', initSound);
        document.removeEventListener('keydown', initSound);
      };
      
      // Add event listeners for first user interaction
      document.addEventListener('click', initSound);
      document.addEventListener('keydown', initSound);
      
      return () => {
        // Clean up event listeners
        document.removeEventListener('click', initSound);
        document.removeEventListener('keydown', initSound);
      };
    } catch (e) {
      console.log("Audio initialization failed:", e);
    }
  }, []);
  
  const [typingStats, setTypingStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 100,
  });
  
  const intervalRef = useRef<number | null>(null);
  const [loadingText, setLoadingText] = useState(false);
  
  // Preload texts for all modes and durations
  useEffect(() => {
    const preloadTexts = async () => {
      // Preload most important modes first
      await preloadMode("normal", duration);
      
      // Then preload other combinations in the background
      Promise.all(ALL_MODES.map(mode => preloadMode(mode, duration)));
    };
    
    preloadTexts();
  }, [duration]);
  
  // Preload texts for a specific mode and duration
  const preloadMode = async (mode: string, testDuration: number) => {
    // Initialize cache structure if needed
    if (!textCache[mode]) {
      textCache[mode] = {};
    }
    
    // If this mode+duration combination doesn't exist or is low on texts
    if (!textCache[mode][testDuration] || textCache[mode][testDuration].length < 3) {
      // Create or ensure array exists
      if (!textCache[mode][testDuration]) {
        textCache[mode][testDuration] = [];
      }
      
      // Fetch 3 texts from API
      try {
        // Try API first
        const response = await fetch(`/api/texts/${mode}?count=3&duration=${testDuration}`);
        if (response.ok) {
          const texts = await response.json();
          if (Array.isArray(texts) && texts.length > 0) {
            // Add to cache
            textCache[mode][testDuration].push(...texts);
            return;
          }
        }
      } catch (err) {
        console.log("Error fetching from API, using fallback");
      }
      
      // API failed, use local generator as fallback
      const texts = await Promise.all([
        getRandomText(mode, testDuration),
        getRandomText(mode, testDuration),
        getRandomText(mode, testDuration)
      ]);
      
      textCache[mode][testDuration].push(...texts);
    }
  };
  
  // Get text from cache or fetch new one
  const getTextForTest = async (mode: string, testDuration: number) => {
    // Check if we're already fetching text
    if (fetchLock.isLocked) {
      // Wait a bit and try again if someone else is fetching
      return new Promise<string>(resolve => {
        setTimeout(() => {
          getTextForTest(mode, testDuration).then(resolve);
        }, 200);
      });
    }
    
    // Set the lock to prevent multiple concurrent fetches
    fetchLock.isLocked = true;
    setLoadingText(true);
    
    try {
      // Check if we have cached texts
      if (textCache[mode]?.[testDuration]?.length > 0) {
        // Get a text and remove it from the cache
        const text = textCache[mode][testDuration].pop()!;
        
        // Replenish cache in the background AFTER we've returned the text
        // This prevents other API calls from happening during text rendering
        setTimeout(() => {
          if (textCache[mode][testDuration].length < 2) {
            preloadMode(mode, testDuration);
          }
        }, 500);
        
        setLoadingText(false);
        fetchLock.isLocked = false;
        return text;
      }
      
      // If no cached text is available, fetch directly
      try {
        const response = await fetch(`/api/texts/${mode}?duration=${testDuration}`);
        if (response.ok) {
          const texts = await response.json();
          if (Array.isArray(texts) && texts.length > 0) {
            // Start preloading more in the background AFTER returning
            setTimeout(() => {
              preloadMode(mode, testDuration);
            }, 500);
            
            setLoadingText(false);
            fetchLock.isLocked = false;
            return texts[0];
          }
        }
      } catch (err) {
        console.log("API error, using fallback generator");
      }
      
      // Fallback to client-side generator
      const text = await getRandomText(mode, testDuration);
      setLoadingText(false);
      fetchLock.isLocked = false;
      return text;
    } catch (error) {
      console.error("Error getting text:", error);
      setLoadingText(false);
      fetchLock.isLocked = false;
      return "Text loading failed. Click to try again.";
    }
  };
  
  // No backend data saving - just a simple function for compatibility
  const mutate = (data: TypingTestResult) => {
    // Just log the result - no backend saving
    console.log("Test result (not saved to backend):", data);
  };
  
  // Load initial text
  useEffect(() => {
    if (!typingState.text) {
      getTextForTest(typingState.mode, duration).then(text => {
        setTypingState(prev => ({ ...prev, text }));
      });
    }
  }, []);
  
  // Update timer and text when duration changes
  useEffect(() => {
    if (!typingState.isActive) {
      setTypingState(prev => ({
        ...prev, 
        timeRemaining: duration
      }));
      
      // When duration changes and test is not active, also get new text with proper length
      getTextForTest(typingState.mode, duration).then(text => {
        setTypingState(prev => ({ ...prev, text }));
      });
    }
  }, [duration, typingState.isActive, typingState.mode]);
  
  // Define endTest first, before other useEffects that might call it
  const endTest = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const correctCount = typingState.correctChars.length;
    const totalTyped = correctCount + typingState.incorrectChars.length;

    if (totalTyped > 0) {
        let finalWpm = typingStats.wpm;
        let finalAccuracy = typingStats.accuracy;

        if (typingState.startTime !== null) {
            const elapsedSeconds = (Date.now() - typingState.startTime) / 1000;
            const elapsedMinutes = elapsedSeconds / 60;
            if (elapsedMinutes > 0) {
                const words = correctCount / 5;
                finalWpm = Math.round(words / elapsedMinutes) || 0;
                finalAccuracy = Math.round((correctCount / totalTyped) * 100) || 0;
            }
        }
        finalAccuracy = finalAccuracy > 0 ? finalAccuracy : 0;
        finalAccuracy = totalTyped === 0 ? 0 : Math.round((correctCount / totalTyped) * 100);
        finalAccuracy = Math.max(0, finalAccuracy);


        const result: TypingTestResult = {
            wpm: finalWpm,
            accuracy: finalAccuracy,
            duration: Math.max(1, Math.round((Date.now() - (typingState.startTime || Date.now())) / 1000)),
            mode: typingState.mode,
            characters: totalTyped,
            errors: typingState.incorrectChars.length,
        };

        mutate(result);
        onComplete(result);
    } else if (typingState.timeRemaining <=0 && totalTyped === 0) {
        const result: TypingTestResult = {
            wpm: 0,
            accuracy: 0,
            duration: duration,
            mode: typingState.mode,
            characters: 0,
            errors: 0,
        };
        mutate(result);
        onComplete(result);
    }

    setTypingState(prev => ({
      ...prev,
      isActive: false,
      startTime: null,
      timeRemaining: duration,
    }));
    
  }, [typingStats, typingState, duration, onComplete, mutate]);
  
  // Timer effect - consolidated logic
  useEffect(() => {
    if (typingState.isActive && typingState.startTime && typingState.timeRemaining > 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current); // Clear previous interval if any
      }
      intervalRef.current = window.setInterval(() => {
        setTypingState(prev => {
          // Ensure we are still active and have time remaining
          if (!prev.isActive || prev.timeRemaining <= 1) { // Check for <= 1 because we're about to decrement
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }

            // Time has expired or test became inactive
            const correctCount = prev.correctChars.length;
            const totalTyped = correctCount + prev.incorrectChars.length;
            let finalWpm = 0;
            let finalAccuracy = 0;

            if (totalTyped === 0) {
              finalWpm = 0;
              finalAccuracy = 0;
            } else if (prev.startTime !== null) {
              // Calculate elapsed time based on when the test actually started
              const actualElapsedSeconds = (Date.now() - prev.startTime) / 1000;
              // Duration for WPM should be the configured duration, or actual elapsed if shorter (e.g. early completion)
              // For time expiry, it's the full duration.
              const WPMCalculationDurationSeconds = duration;
              const elapsedMinutes = WPMCalculationDurationSeconds / 60;

              if (elapsedMinutes > 0) {
                const words = correctCount / 5;
                finalWpm = Math.round(words / elapsedMinutes) || 0;
                finalAccuracy = Math.round((correctCount / totalTyped) * 100);
              }
            }

            finalAccuracy = totalTyped === 0 ? 0 : Math.round((correctCount / totalTyped) * 100);
            finalAccuracy = Math.max(0, finalAccuracy);


            const result: TypingTestResult = {
              wpm: finalWpm,
              accuracy: finalAccuracy,
              duration: duration,
              mode: prev.mode,
              characters: totalTyped,
              errors: prev.incorrectChars.length,
            };

            mutate(result);
            onComplete(result);

            return {
              ...prev,
              isActive: false,
              currentPosition: prev.currentPosition, // Keep position for results display
              // correctChars: [], // Keep for results
              // incorrectChars: [], // Keep for results
              startTime: null,
              timeRemaining: 0, // Explicitly set to 0
            };
          }
          // Normal decrement
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    } else if (!typingState.isActive || typingState.timeRemaining <= 0) {
      // Clear interval if test becomes inactive or time is already up
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [typingState.isActive, typingState.startTime, duration, onComplete, mutate]); // Removed typingState.timeRemaining from deps to avoid re-triggering interval setup on each tick
  
  // Live stats calculation (optimized to update every 100ms instead of on every keystroke)
  useEffect(() => {
    if (typingState.isActive && typingState.startTime !== null) {
      const statsInterval = setInterval(() => {
        const correctCount = typingState.correctChars.length;
        const totalTyped = correctCount + typingState.incorrectChars.length;
        
        if (totalTyped > 0) {
          // Calculate WPM
          const elapsedMinutes = typingState.startTime !== null ? (Date.now() - typingState.startTime) / 60000 : 0;
          if (elapsedMinutes > 0) {
            const words = correctCount / 5; // Standard: 5 chars = 1 word
            const wpm = Math.round(words / elapsedMinutes) || 0;
            
            // Calculate accuracy
            const accuracy = Math.round((correctCount / totalTyped) * 100) || 100;
            
            setTypingStats({ wpm, accuracy });
          }
        }
      }, 100);
      
      return () => clearInterval(statsInterval);
    }
  }, [typingState.isActive, typingState.startTime, typingState.correctChars.length, typingState.incorrectChars.length]);
  
  // Start the test
  const startTest = useCallback(() => {
    setTypingState(prev => ({
      ...prev,
      isActive: true,
      startTime: Date.now(),
      timeRemaining: duration,
    }));
  }, [duration]);
  
  // Reset the test
  const resetTest = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setTypingStats({
      wpm: 0,
      accuracy: 100,
    });
    
    // Reset typing state but keep the mode
    setTypingState(prev => ({
      ...prev,
      isActive: false,
      currentPosition: 0,
      correctChars: [],
      incorrectChars: [],
      startTime: null,
      timeRemaining: duration,
      // Don't clear the text immediately to avoid flashing blank screen
    }));
    
    // Get new text for the same mode with proper duration
    getTextForTest(typingState.mode, duration).then(text => {
      setTypingState(prev => ({ ...prev, text }));
    });
  }, [duration, typingState.mode]);
  
  // Handle keyboard input
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    // Check for Ctrl+Enter or Alt+Enter to restart (more reliable than Tab+Enter)
    if (e.key === 'Enter' && (e.ctrlKey || e.altKey)) {
      e.preventDefault();
      resetTest();
      return;
    }
    
    // Start test on first key press
    if (!typingState.isActive) {
      startTest();
    }
    
    // Only process alphanumeric keys, punctuation, spaces, backspace
    if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Tab') {
      e.preventDefault(); // Prevent default browser behavior
      
      // Play sound if enabled - for ALL keys including Backspace and Tab
      if (settings.soundEnabled) {
        // Create a new sound instance with the appropriate sound type
        let keyType: 'normal' | 'backspace' | 'tab' = 'normal';
        
        if (e.key === 'Backspace') {
          keyType = 'backspace';
        } else if (e.key === 'Tab') {
          keyType = 'tab';
        }
        
        // Create a new sound instance each time to avoid overlapping play issues
        const sound = createKeySound(keyType);
        sound.play().catch(err => {
          // Silently fail without console error to avoid filling up the console
          // console.error("Could not play sound:", err);
        });
      }
      
      if (e.key === 'Tab') {
        // Special handling for tab in code examples - treat as two spaces
        if (typingState.currentPosition < typingState.text.length) {
          const nextChars = typingState.text.substring(
            typingState.currentPosition, 
            typingState.currentPosition + 2
          );
          
          if (nextChars === '  ') {
            // Tab matches two spaces, consider it correct
            setTypingState(prev => ({
              ...prev,
              currentPosition: prev.currentPosition + 2,
              correctChars: [...prev.correctChars, prev.currentPosition, prev.currentPosition + 1]
            }));
          }
        }
        
        return;
      }
      
      if (e.key.length === 1) {
        // Regular character input
        const expectedChar = typingState.text[typingState.currentPosition];
        
        // If we're at the end of the text, don't process more input
        if (typingState.currentPosition >= typingState.text.length) {
          endTest();
          return;
        }
        
        // Sound is already played above for all key presses
        
        setTypingState(prev => {
          const newState = { ...prev, currentPosition: prev.currentPosition + 1 };
          
          if (e.key === expectedChar) {
            newState.correctChars = [...prev.correctChars, prev.currentPosition];
          } else {
            newState.incorrectChars = [...prev.incorrectChars, prev.currentPosition];
          }
          
          // End test if we've reached the end of the text
          if (newState.currentPosition >= typingState.text.length) {
            // Use setTimeout with longer delay to ensure state is fully updated
            setTimeout(() => endTest(), 100);
          }
          
          return newState;
        });
      } else if (e.key === 'Backspace') {
        // Handle backspace to delete the previous character
        
        // Sound is already played above for all key presses
        
        setTypingState(prev => {
          if (prev.currentPosition > 0) {
            const newPos = prev.currentPosition - 1;
            const newCorrectChars = prev.correctChars.filter(pos => pos !== newPos);
            const newIncorrectChars = prev.incorrectChars.filter(pos => pos !== newPos);
            
            return {
              ...prev,
              currentPosition: newPos,
              correctChars: newCorrectChars,
              incorrectChars: newIncorrectChars,
            };
          }
          return prev;
        });
      }
    }
  }, [typingState, startTest, endTest, resetTest, settings.soundEnabled]);
  
  // Change typing mode
  const changeMode = useCallback((mode: string) => {
    setLoadingText(true);
    
    // Reset typing state and update the mode
    setTypingState(prev => ({
      ...prev,
      mode,
      isActive: false,
      currentPosition: 0,
      correctChars: [],
      incorrectChars: [],
      startTime: null,
      timeRemaining: duration,
    }));
    
    setTypingStats({
      wpm: 0,
      accuracy: 100,
    });
    
    // Get text for the new mode
    getTextForTest(mode, duration).then(text => {
      setTypingState(prev => ({ ...prev, text }));
    });
  }, [duration]);
  
  const handleTypingAreaClick = useCallback(() => {
    // Start test if clicked and not already active
    if (!typingState.isActive) {
      startTest();
    }
  }, [typingState.isActive, startTest]);
  

  
  // Function to load a new text for the current mode
  const loadNewText = useCallback(() => {
    getTextForTest(typingState.mode, duration).then(text => {
      setTypingState(prev => ({ ...prev, text }));
    });
  }, [typingState.mode, duration]);
  
  return {
    typingState,
    typingStats,
    handleKeyDown,
    handleTypingAreaClick,
    resetTest,
    changeMode,
    loadingText,
    loadNewText,
  };
}
