import { KeyboardEvent, useRef, useEffect } from "react";
import { Loader2, MousePointer, Keyboard } from "lucide-react";

interface TextDisplayProps {
  text: string;
  currentPosition: number;
  correctChars: number[];
  incorrectChars: number[];
  isActive: boolean;
  loading: boolean;
  onClick: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
}

export default function TextDisplay({
  text,
  currentPosition,
  correctChars,
  incorrectChars,
  isActive,
  loading,
  onClick,
  onKeyDown
}: TextDisplayProps) {
  const typingAreaRef = useRef<HTMLDivElement>(null);
  
  // Focus the typing area when it changes
  useEffect(() => {
    if (typingAreaRef.current) {
      typingAreaRef.current.focus();
    }
  }, [text]);
  
  // Render each character with proper class
  const renderChars = () => {
    return text.split('').map((char, index) => {
      let className = "char";
      
      if (index === currentPosition) {
        className += " current";
      } else if (index < currentPosition) {
        if (correctChars.includes(index)) {
          className += " correct";
        } else if (incorrectChars.includes(index)) {
          className += " incorrect";
        }
      }
      
      // Handle spaces in a way that makes them visible
      if (char === ' ') {
        return <span key={index} className={className}>&nbsp;</span>;
      } else if (char === '\n') {
        return <br key={index} />;
      }
      
      return <span key={index} className={className}>{char}</span>;
    });
  };
  
  if (loading) {
    return (
      <div className="relative font-mono text-lg leading-relaxed text-secondary bg-background p-5 rounded-lg mb-4 flex flex-col justify-center items-center min-h-[180px]">
        <Loader2 className="h-8 w-8 text-accent animate-spin mb-2" />
        <span className="text-sm text-secondary animate-pulse">Loading text...</span>
      </div>
    );
  }
  
  return (
    <div 
      ref={typingAreaRef}
      className="relative font-mono text-lg leading-relaxed text-secondary overflow-hidden bg-background p-5 rounded-lg mb-4 select-none outline-none border border-accent/10 shadow-lg transition-all duration-300 hover:border-accent/20"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      <div className="typing-animation whitespace-pre-wrap">
        {renderChars()}
      </div>
      
      {!isActive && (
        <div className="mt-6 text-center flex flex-col items-center justify-center space-y-3">
          <div className="flex items-center gap-2 bg-accent/5 px-4 py-2 rounded-full">
            <MousePointer className="h-4 w-4 text-accent animate-bounce" />
            <span className="text-secondary text-sm">Click here or press any key to start typing</span>
          </div>
          
          <div className="flex items-center gap-2 bg-black/10 px-4 py-2 rounded-full">
            <Keyboard className="h-4 w-4 text-secondary" />
            <span className="text-xs text-secondary">
              Use <span className="text-accent font-mono bg-black/20 px-1.5 py-0.5 rounded">Ctrl+Enter</span> or <span className="text-accent font-mono bg-black/20 px-1.5 py-0.5 rounded">Alt+Enter</span> to restart
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
