import { useState, useEffect, useCallback, KeyboardEvent, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
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

// Audio setup
const keySound = new Audio("https://www.soundjay.com/buttons/sounds/button-3.mp3");
keySound.volume = 0.5;

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
  
  // Fetch the text based on selected mode and duration
  const { data: texts, isLoading: loadingText, refetch } = useQuery({
    queryKey: [`/api/texts/${typingState.mode}`, { duration }],
    enabled: false,
  });
  
  // Save test result mutation
  const { mutate } = useMutation({
    mutationFn: async (data: TypingTestResult) => {
      return await apiRequest("POST", "/api/typing-tests", data);
    },
  });
  
  // Load initial text
  useEffect(() => {
    if (!typingState.text) {
      // If the API fails, use local text generator as fallback
      getRandomText(typingState.mode, duration).then(text => {
        setTypingState(prev => ({ ...prev, text }));
      });
      
      // Try to fetch from API
      refetch().then(result => {
        const data = result.data as string[] | undefined;
        if (data && data.length > 0) {
          setTypingState(prev => ({ ...prev, text: data[0] }));
        }
      });
    }
  }, [typingState.mode, typingState.text, refetch, duration]);
  
  // Timer effect
  useEffect(() => {
    if (typingState.isActive && typingState.startTime) {
      intervalRef.current = window.setInterval(() => {
        setTypingState(prev => {
          const newTimeRemaining = prev.timeRemaining - 1;
          
          if (newTimeRemaining <= 0) {
            endTest();
            return { ...prev, timeRemaining: 0 };
          }
          
          return { ...prev, timeRemaining: newTimeRemaining };
        });
      }, 1000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [typingState.isActive, typingState.startTime]);
  
  // Calculate stats when typing progresses
  useEffect(() => {
    if (typingState.isActive && typingState.startTime) {
      const correctCount = typingState.correctChars.length;
      const totalTyped = correctCount + typingState.incorrectChars.length;
      
      if (totalTyped > 0) {
        // Calculate WPM
        const elapsedMinutes = (Date.now() - typingState.startTime) / 60000;
        const words = correctCount / 5; // Standard: 5 chars = 1 word
        const wpm = Math.round(words / elapsedMinutes) || 0;
        
        // Calculate accuracy
        const accuracy = Math.round((correctCount / totalTyped) * 100) || 100;
        
        setTypingStats({ wpm, accuracy });
      }
    }
  }, [typingState.correctChars, typingState.incorrectChars, typingState.isActive, typingState.startTime]);
  
  // Start the test
  const startTest = useCallback(() => {
    setTypingState(prev => ({
      ...prev,
      isActive: true,
      startTime: Date.now(),
      timeRemaining: duration,
    }));
  }, [duration]);
  
  // End the test
  const endTest = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    const result: TypingTestResult = {
      wpm: typingStats.wpm,
      accuracy: typingStats.accuracy,
      duration,
      mode: typingState.mode,
      characters: typingState.correctChars.length + typingState.incorrectChars.length,
      errors: typingState.incorrectChars.length,
    };
    
    // Save the result to API
    mutate(result);
    
    // Notify parent component
    onComplete(result);
    
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
  }, [typingStats, typingState, duration, onComplete, mutate]);
  
  // Reset the test
  const resetTest = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
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
    }));
    
    // Get new text for the same mode with proper duration
    getRandomText(typingState.mode, duration).then(text => {
      setTypingState(prev => ({ ...prev, text }));
    });
    
    // Try to fetch from API
    refetch().then(result => {
      const data = result.data as string[] | undefined;
      if (data && data.length > 0) {
        setTypingState(prev => ({ ...prev, text: data[0] }));
      }
    });
  }, [duration, typingState.mode, refetch]);
  
  // Handle keyboard input
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    // Check for Ctrl+Enter or Alt+Enter to restart (more reliable than Tab+Enter)
    if (e.key === 'Enter' && (e.ctrlKey || e.altKey)) {
      resetTest();
      return;
    }
    
    // Start test on first key press
    if (!typingState.isActive) {
      startTest();
    }
    
    // Only process alphanumeric keys, punctuation, spaces, backspace
    if (e.key.length === 1 || e.key === 'Backspace') {
      // Play sound if enabled
      if (settings.soundEnabled && e.key.length === 1) {
        keySound.currentTime = 0;
        keySound.play().catch(err => console.error("Could not play sound:", err));
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
    // Reset typing state and update the mode
    setTypingState(prev => ({
      ...prev,
      mode,
      isActive: false,
      text: "",
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
  }, [duration]);
  
  const handleTypingAreaClick = useCallback(() => {
    // Just focus the area, the keydown handler will take care of starting the test
  }, []);
  
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
