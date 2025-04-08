import { RefreshCcw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TestInfoProps {
  wpm: number;
  accuracy: number;
  timeRemaining: number;
  onReset: () => void;
}

export default function TestInfo({ wpm, accuracy, timeRemaining, onReset }: TestInfoProps) {
  return (
    <div className="w-full max-w-3xl mb-8">
      <div className="flex justify-between items-center">
        {/* Test Statistics */}
        <div className="flex space-x-6">
          <div className="text-center">
            <p className="text-accent text-2xl font-mono">{wpm}</p>
            <p className="text-secondary text-xs uppercase tracking-wider">WPM</p>
          </div>
          
          <div className="text-center">
            <p className="text-foreground text-2xl font-mono">{accuracy}%</p>
            <p className="text-secondary text-xs uppercase tracking-wider">accuracy</p>
          </div>
          
          <div className="text-center">
            <p className="text-foreground text-2xl font-mono">{timeRemaining}s</p>
            <p className="text-secondary text-xs uppercase tracking-wider">time</p>
          </div>
        </div>
        
        {/* Restart Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="text-secondary hover:text-accent transition-colors" 
                onClick={onReset}
              >
                <RefreshCcw className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Restart test</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
