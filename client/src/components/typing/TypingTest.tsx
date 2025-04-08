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
    setSelectedDuration(duration);
    resetTest();
  };

  const handleModeChange = (mode: string) => {
    if ((mode === "flirty" || mode === "developer") && typingState.mode !== mode) {
      onModePreviewRequest(mode);
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
          press <span className="text-accent font-mono px-1">tab</span> + <span className="text-accent font-mono px-1">enter</span> to restart test
        </div>
      </div>
    </>
  );
}
