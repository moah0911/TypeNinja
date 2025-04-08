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
      className="relative font-mono text-lg leading-relaxed text-secondary overflow-hidden bg-gradient-to-b from-background/90 to-background p-6 rounded-xl mb-4 select-none outline-none border border-accent/15 shadow-xl transition-all duration-300 hover:border-accent/30 backdrop-blur-sm"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onKeyDown}
      style={{boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 120, 255, 0.05)"}}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500/30 to-indigo-500/30 rounded-t-xl"></div>
      <div className="typing-animation whitespace-pre-wrap tracking-wide">
        {renderChars()}
      </div>
      
      {!isActive && (
        <div className="mt-8 text-center flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center gap-3 bg-gradient-to-r from-sky-500/10 to-indigo-500/10 backdrop-blur-md px-5 py-3 rounded-lg border border-sky-500/20">
            <MousePointer className="h-5 w-5 text-sky-400 animate-bounce" />
            <span className="text-sky-100 text-sm font-medium">Click here or press any key to start typing</span>
          </div>
          
          <div className="flex items-center gap-3 bg-black/15 backdrop-blur-md px-5 py-2.5 rounded-lg border border-white/5">
            <Keyboard className="h-4 w-4 text-sky-300" />
            <span className="text-xs text-sky-100/80">
              Use <span className="text-sky-300 font-mono bg-black/30 px-2 py-0.5 rounded-md border border-sky-500/20">Ctrl+Enter</span> or <span className="text-sky-300 font-mono bg-black/30 px-2 py-0.5 rounded-md border border-sky-500/20">Alt+Enter</span> to restart
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
