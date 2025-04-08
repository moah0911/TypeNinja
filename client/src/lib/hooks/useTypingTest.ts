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

// Audio setup - use base64 encoded sound to avoid external dependencies
const TYPING_SOUND_BASE64 = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAeHh4eHh4eHh4eHh4eHiNjY2NjY2NjY2NjY2Njaqqqqqqqqqqqqqqqqqqx8fHx8fHx8fHx8fHx8f///////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAYAAAAAAAAAAbAwjDrEAAAAAAD/+0DEAAAGBKNz9BEAJPhUrn80IAC5FGksBAIBABAKIiO5+c53tPBwMBgMBglCUJQlCQAAJQlCUJc+c/////Lnc/////+c9znPBAMBAIAwAJcUi8MpO0kwS8pc7N9szG0ITuLS4jdYgPEqRCYbLEYhKVKUo6aoYm6YJxGPQqKCdpimEw0p5HRU1NVVUEfBN0wgm6CfoqUE3qKio+jkE3KVOi1FKnKnKmqdRVOqyFRFSioqmqbYiD2KyaUkqFRZqiV/9bL/+0LEBgAIEVtp56RviQWrbD2HjfHlP1TWpUqVLU//1f/USSokDEpMjkqlTTyGRyHJJJFSipRJJ7ERLh0BAMBAMDAAMDAQDAxFNQACAYGJgADAwMQAwbOsCgBgIgBm1MASAGCSAGAaAGAKgBwEoBgYCdZ0aOXIUVf////z3957rymta1rWOuc9rWOt7QYCABn//1xAADAwEAwMBIAMDAQAwMBEAMDASADA59EAJ//6qABiqbXf/Sas1jGv+1rWtZKZxjrnGMYxrGsa5/zn/9a5z2ta7/rWta12ta//+0LEC4AKBV9l7CRvQXGrbD2HlehhADASADAwEAACAYACAAYCABgCABOe4lQADFDr3/1VVVVXet///5znOc5zv//////////////wiABioAXJkACYIgCYOoCYKYBYFABYHICYHYCgFgEwMAOTRAUwJwDl4TCGAqA+AiASAcAUAYAD/w+goALAJgKgHgGAK//////////9a1rWta1rWvOc5znOc5znP//////////////8YxjGMYxjGMYxjGMYxjGMYxrGsa//tCxA4AClVbY+wkbwlNq2v9h43xjGMYxjGMYxjnOc5znOc5znOc5zXOc5znOc5znMa5rWtYxrWtd7Wtd7Wtd7WtYxrWtYxjGMYsYxYxYxYxYAAAAAAAQAAAAAACqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqlVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tCxBUAClVbYewkbwkiquw9lI2BVVVVVVVVVVVVVVVMQQRAMCRAMBEAMDAQADASAAAAgGAgAGBgIgBgYCQAYGAlVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7QsQZgAowgWOMJG/RSjAsAYSNaVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7QsQfAAo0gV2MJGspQZBrMYSNaVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==";

// Audio setup
const keySound = new Audio(TYPING_SOUND_BASE64);
keySound.volume = 0.5;

// Global text cache (shared between instances)
const textCache: TextCache = {};

// Global lock to prevent multiple concurrent text fetches that might cause text changes
const fetchLock = { isLocked: false };

// List of all available modes for preloading
const ALL_MODES = ["normal", "flirty", "developer", "python", "java", "csharp", "go"];
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
    // Clear timer interval if exists
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Calculate final stats
    const correctCount = typingState.correctChars.length;
    const totalTyped = correctCount + typingState.incorrectChars.length;
    
    // Show results even if the user hasn't typed anything when time runs out
    // (which would mean they get a 0 WPM result)
    const timeExpired = typingState.timeRemaining <= 0;
    const completedEarly = typingState.currentPosition >= typingState.text.length;
    
    // Always show results at least for time expiration, otherwise require typed characters
    if (timeExpired || (totalTyped > 0 && completedEarly)) {
      let finalWpm = typingStats.wpm;
      let finalAccuracy = typingStats.accuracy;
      
      // If no typing occurred, set to zeros
      if (totalTyped === 0) {
        finalWpm = 0;
        finalAccuracy = 0;
      } else {
        // Recalculate final stats to ensure accuracy
        if (typingState.startTime !== null) {
          const elapsedMinutes = (Date.now() - typingState.startTime) / 60000;
          if (elapsedMinutes > 0) {
            const words = correctCount / 5;
            finalWpm = Math.round(words / elapsedMinutes) || 0;
            finalAccuracy = Math.round((correctCount / totalTyped) * 100) || 100;
          }
        }
      }
      
      // Create result object
      const result: TypingTestResult = {
        wpm: finalWpm,
        accuracy: finalAccuracy > 0 ? finalAccuracy : 0,
        duration: completedEarly ? duration - typingState.timeRemaining : duration, // Actual time used
        mode: typingState.mode,
        characters: totalTyped,
        errors: typingState.incorrectChars.length,
      };
      
      // Save the result to API
      mutate(result);
      
      // Notify parent component to show results
      onComplete(result);
    }
    
    // Reset test state but keep the mode
    setTypingState(prev => ({
      ...prev,
      isActive: false,
      currentPosition: 0,
      correctChars: [],
      incorrectChars: [],
      startTime: null,
      timeRemaining: duration,
    }));
    
    // Get a new text ready for the next test
    getTextForTest(typingState.mode, duration).then(text => {
      setTypingState(prev => ({ ...prev, text }));
    });
  }, [typingStats, typingState, duration, onComplete, mutate]);
  
  // Timer effect - going back to a simpler implementation
  useEffect(() => {
    // Only run timer when test is active with a valid start time
    if (typingState.isActive && typingState.startTime) {
      // Clear any existing timer first to avoid duplicates
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      // Set up a new timer interval
      intervalRef.current = window.setInterval(() => {
        setTypingState(prev => {
          if (prev.timeRemaining <= 0) {
            // Already at zero, don't keep decrementing
            return prev;
          }
          
          const newTimeRemaining = prev.timeRemaining - 1;
          return { ...prev, timeRemaining: Math.max(0, newTimeRemaining) };
        });
      }, 1000);
    }
    
    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [typingState.isActive, typingState.startTime]);
  
  // Handle time expiration check without using endTest in a separate effect
  useEffect(() => {
    // We only care about the transition from 1 to 0 seconds while the test is active
    if (typingState.isActive && typingState.timeRemaining === 0) {
      // Use a local variable to prevent closure issues
      const isActive = typingState.isActive;
      const correctChars = [...typingState.correctChars];
      const incorrectChars = [...typingState.incorrectChars];
      const totalTyped = correctChars.length + incorrectChars.length;
      const mode = typingState.mode;
      
      // Calculate stats for the result
      let finalWpm = typingStats.wpm;
      let finalAccuracy = typingStats.accuracy;
      
      // Handle edge case of no typing
      if (totalTyped === 0) {
        finalWpm = 0;
        finalAccuracy = 0;
      } else if (typingState.startTime !== null) {
        // Double-check calculations
        const elapsedMinutes = (Date.now() - typingState.startTime) / 60000;
        if (elapsedMinutes > 0) {
          const words = correctChars.length / 5;
          finalWpm = Math.round(words / elapsedMinutes) || 0;
          finalAccuracy = Math.round((correctChars.length / totalTyped) * 100) || 100;
        }
      }
      
      // Create result object
      const result: TypingTestResult = {
        wpm: finalWpm,
        accuracy: finalAccuracy > 0 ? finalAccuracy : 0,
        duration: duration, // Test completed due to time expiry
        mode: mode,
        characters: totalTyped,
        errors: incorrectChars.length,
      };
      
      // Save the result
      mutate(result);
      
      // Send to parent
      onComplete(result);
      
      // Reset test state
      setTypingState(prev => ({
        ...prev,
        isActive: false,
        currentPosition: 0,
        correctChars: [],
        incorrectChars: [],
        startTime: null,
        timeRemaining: duration,
      }));
      
      // Get a new text for the next test
      getTextForTest(typingState.mode, duration).then(text => {
        setTypingState(prev => ({ ...prev, text }));
      });
    }
  }, [typingState.timeRemaining, typingState.isActive, typingStats, typingState, duration, onComplete, mutate]);
  

  
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
      
      // Play sound if enabled
      if (settings.soundEnabled && e.key.length === 1) {
        keySound.currentTime = 0;
        keySound.play().catch(err => console.error("Could not play sound:", err));
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
        
        setTypingState(prev => {
          const newState = { ...prev, currentPosition: prev.currentPosition + 1 };
          
          if (e.key === expectedChar) {
            newState.correctChars = [...prev.correctChars, prev.currentPosition];
          } else {
            newState.incorrectChars = [...prev.incorrectChars, prev.currentPosition];
          }
          
          // End test if we've reached the end of the text
          if (newState.currentPosition >= typingState.text.length) {
            // Use setTimeout to ensure state is updated before calling endTest
            setTimeout(() => endTest(), 10);
          }
          
          return newState;
        });
      } else if (e.key === 'Backspace') {
        // Handle backspace to delete the previous character
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
  

  
  return {
    typingState,
    typingStats,
    handleKeyDown,
    handleTypingAreaClick,
    resetTest,
    changeMode,
    loadingText,
  };
}
