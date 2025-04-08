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
        <div className="flex items-center space-x-6 bg-gradient-to-r from-black/20 to-black/10 rounded-2xl p-3 backdrop-blur-sm border border-white/5 shadow-lg">
          <div className="flex items-center gap-3 border-r border-sky-500/10 pr-6">
            <div className="bg-gradient-to-br from-sky-500/20 to-indigo-500/10 p-2.5 rounded-xl border border-sky-500/20 shadow-md">
              <Zap className="h-5 w-5 text-sky-400" />
            </div>
            <div>
              <p className="text-sky-400 text-3xl font-bold leading-none">{wpm}</p>
              <p className="text-secondary text-xs uppercase tracking-wider font-medium">WPM</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 border-r border-sky-500/10 pr-6">
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 p-2.5 rounded-xl border border-green-500/20 shadow-md">
              <BarChart className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-green-400 text-3xl font-bold leading-none">{accuracy}%</p>
              <p className="text-secondary text-xs uppercase tracking-wider font-medium">accuracy</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`
              ${timeRemaining <= 10 && isFlashing ? 
                'bg-gradient-to-br from-red-500/30 to-red-500/10 border-red-500/30' : 
                'bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/20'} 
              p-2.5 rounded-xl border shadow-md transition-all duration-300`}>
              <Clock className={`h-5 w-5 ${timeRemaining <= 10 && isFlashing ? 'text-red-400' : 'text-blue-400'} transition-colors`} />
            </div>
            <div>
              <p className={`${timeRemaining <= 10 && isFlashing ? 'text-red-400' : 'text-blue-400'} text-3xl font-bold leading-none transition-colors`}>
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
                className="bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border border-sky-500/20 hover:bg-sky-500/20 hover:text-sky-400 transition-all shadow-lg"
                onClick={onReset}
                style={{boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(56, 189, 248, 0.1)"}}
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
