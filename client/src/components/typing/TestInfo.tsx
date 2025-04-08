import { RefreshCcw, Zap, BarChart, Clock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface TestInfoProps {
  wpm: number;
  accuracy: number;
  timeRemaining: number;
  onReset: () => void;
}

export default function TestInfo({ wpm, accuracy, timeRemaining, onReset }: TestInfoProps) {
  // State to track time flashing
  const [isFlashing, setIsFlashing] = useState(false);
  
  // Flash timer when time is getting low
  useEffect(() => {
    if (timeRemaining <= 10 && timeRemaining > 0) {
      // Start flashing
      const flashInterval = setInterval(() => {
        setIsFlashing(prev => !prev);
      }, 500);
      
      return () => clearInterval(flashInterval);
    } else {
      setIsFlashing(false);
    }
  }, [timeRemaining]);
  
  return (
    <div className="w-full max-w-4xl mb-8">
      <div className="flex justify-between items-center">
        {/* Test Statistics */}
        <div className="flex items-center space-x-6 bg-black/20 rounded-2xl p-3 backdrop-blur-sm">
          <div className="flex items-center gap-2 border-r border-accent/10 pr-6">
            <div className="bg-accent/10 p-2 rounded-lg">
              <Zap className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-accent text-3xl font-bold leading-none">{wpm}</p>
              <p className="text-secondary text-xs uppercase tracking-wider font-medium">WPM</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 border-r border-accent/10 pr-6">
            <div className="bg-green-500/10 p-2 rounded-lg">
              <BarChart className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-green-500 text-3xl font-bold leading-none">{accuracy}%</p>
              <p className="text-secondary text-xs uppercase tracking-wider font-medium">accuracy</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`${timeRemaining <= 10 && isFlashing ? 'bg-red-500/20' : 'bg-blue-500/10'} p-2 rounded-lg transition-colors`}>
              <Clock className={`h-5 w-5 ${timeRemaining <= 10 && isFlashing ? 'text-red-500' : 'text-blue-500'} transition-colors`} />
            </div>
            <div>
              <p className={`${timeRemaining <= 10 && isFlashing ? 'text-red-500' : 'text-blue-500'} text-3xl font-bold leading-none transition-colors`}>
                {timeRemaining}s
              </p>
              <p className="text-secondary text-xs uppercase tracking-wider font-medium">time left</p>
            </div>
          </div>
        </div>
        
        {/* Restart Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline"
                size="icon"
                className="bg-black/20 border-accent/10 hover:bg-accent/10 hover:text-accent transition-all"
                onClick={onReset}
              >
                <RefreshCcw className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Restart test</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
