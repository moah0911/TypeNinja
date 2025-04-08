import { useState } from "react";
import TestInfo from "./TestInfo";
import ModeSelector from "./ModeSelector";
import TextDisplay from "./TextDisplay";
import { useTypingTest } from "@/lib/hooks/useTypingTest";
import { TypingTestResult } from "@/types";

interface TypingTestProps {
  onTestComplete: (result: TypingTestResult) => void;
  onModePreviewRequest: (mode: string) => void;
}

export default function TypingTest({ onTestComplete, onModePreviewRequest }: TypingTestProps) {
  const [selectedDuration, setSelectedDuration] = useState(30);
  
  const {
    typingState,
    typingStats,
    handleKeyDown,
    handleTypingAreaClick,
    resetTest,
    changeMode,
    loadingText,
  } = useTypingTest({
    duration: selectedDuration,
    onComplete: onTestComplete,
  });

  const handleDurationChange = (duration: number) => {
    // Only update if the duration actually changed
    if (duration !== selectedDuration) {
      setSelectedDuration(duration);
      // Force the test to reset with the new duration
      resetTest();
    } else {
      // If user clicks the same duration again, force a reset anyway
      // This helps ensure text length is appropriate
      resetTest();
    }
  };

  const handleModeChange = (mode: string) => {
    // Show preview for flirty mode
    if (mode === "flirty" && typingState.mode !== mode) {
      onModePreviewRequest(mode);
    }
    
    // Show developer mode preview for any programming language selection
    // if not already in a programming language mode
    const isDeveloperMode = (mode === "developer" || 
                             mode === "python" || 
                             mode === "java" || 
                             mode === "csharp" || 
                             mode === "go");
                             
    const wasAlreadyInDeveloperMode = (typingState.mode === "developer" || 
                                       typingState.mode === "python" || 
                                       typingState.mode === "java" || 
                                       typingState.mode === "csharp" || 
                                       typingState.mode === "go");
    
    // Only show preview if switching to developer mode from a non-developer mode
    if (isDeveloperMode && !wasAlreadyInDeveloperMode) {
      onModePreviewRequest("developer");
    }
    
    changeMode(mode);
  };
  
  return (
    <>
      <TestInfo 
        wpm={typingStats.wpm}
        accuracy={typingStats.accuracy}
        timeRemaining={typingState.timeRemaining}
        onReset={resetTest}
      />
      
      <ModeSelector
        selectedMode={typingState.mode}
        selectedDuration={selectedDuration}
        onModeChange={handleModeChange}
        onDurationChange={handleDurationChange}
      />
      
      <div className="w-full max-w-2xl">
        <TextDisplay
          text={typingState.text}
          currentPosition={typingState.currentPosition}
          correctChars={typingState.correctChars}
          incorrectChars={typingState.incorrectChars}
          isActive={typingState.isActive}
          loading={loadingText}
          onClick={handleTypingAreaClick}
          onKeyDown={handleKeyDown}
        />
        
        <div className="text-center text-secondary text-sm mt-4">
          press <span className="text-accent font-mono px-1">ctrl</span> + <span className="text-accent font-mono px-1">enter</span> or <span className="text-accent font-mono px-1">alt</span> + <span className="text-accent font-mono px-1">enter</span> to restart test
        </div>
      </div>
    </>
  );
}
