import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Award, Zap, BarChart, Check, AlertCircle, Clock, Code, Activity } from "lucide-react";
import { TypingTestResult } from "@/types";
import { useEffect, useState } from "react";

interface ResultsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: TypingTestResult | null;
  onAfterClose?: () => void;
}

export function ResultsModal({ open, onOpenChange, result, onAfterClose }: ResultsModalProps) {
  // Animation states for counting up
  const [animatedWpm, setAnimatedWpm] = useState(0);
  const [animatedAccuracy, setAnimatedAccuracy] = useState(0);
  const [animatedChars, setAnimatedChars] = useState(0);
  const [animatedCorrect, setAnimatedCorrect] = useState(0);
  const [animatedErrors, setAnimatedErrors] = useState(0);
  
  // Handle modal close event to load new text
  useEffect(() => {
    // When modal is closed, trigger the callback to load new text
    if (!open && onAfterClose) {
      onAfterClose();
    }
  }, [open, onAfterClose]);

  // Start counting animation when modal opens
  useEffect(() => {
    if (open && result) {
      // Reset first
      setAnimatedWpm(0);
      setAnimatedAccuracy(0);
      setAnimatedChars(0);
      setAnimatedCorrect(0);
      setAnimatedErrors(0);
      
      // Calculate correct characters
      const correctChars = result.characters - result.errors;
      
      // Animate WPM
      const wpmInterval = setInterval(() => {
        setAnimatedWpm(prev => {
          if (prev >= result.wpm) {
            clearInterval(wpmInterval);
            return result.wpm;
          }
          return Math.min(prev + Math.max(1, Math.floor(result.wpm / 30)), result.wpm);
        });
      }, 20);
      
      // Animate accuracy
      const accuracyInterval = setInterval(() => {
        setAnimatedAccuracy(prev => {
          if (prev >= result.accuracy) {
            clearInterval(accuracyInterval);
            return result.accuracy;
          }
          return Math.min(prev + Math.max(1, Math.floor(result.accuracy / 30)), result.accuracy);
        });
      }, 20);
      
      // Animate characters
      const charsInterval = setInterval(() => {
        setAnimatedChars(prev => {
          if (prev >= result.characters) {
            clearInterval(charsInterval);
            return result.characters;
          }
          return Math.min(prev + Math.max(1, Math.floor(result.characters / 20)), result.characters);
        });
      }, 20);
      
      // Animate correct chars
      const correctInterval = setInterval(() => {
        setAnimatedCorrect(prev => {
          if (prev >= correctChars) {
            clearInterval(correctInterval);
            return correctChars;
          }
          return Math.min(prev + Math.max(1, Math.floor(correctChars / 20)), correctChars);
        });
      }, 25);
      
      // Animate errors
      const errorsInterval = setInterval(() => {
        setAnimatedErrors(prev => {
          if (prev >= result.errors) {
            clearInterval(errorsInterval);
            return result.errors;
          }
          return Math.min(prev + Math.max(1, Math.floor(result.errors / 15)), result.errors);
        });
      }, 30);
      
      return () => {
        clearInterval(wpmInterval);
        clearInterval(accuracyInterval);
        clearInterval(charsInterval);
        clearInterval(correctInterval);
        clearInterval(errorsInterval);
      };
    }
  }, [open, result]);
  
  if (!result) return null;
  
  // Calculate raw WPM (without accuracy adjustment)
  const rawWpm = Math.round((result.characters / 5) / (result.duration / 60)) || 0;
  
  // Calculate correct characters
  const correctChars = result.characters - result.errors;
  
  // Format mode for display 
  const formattedMode = result.mode.charAt(0).toUpperCase() + result.mode.slice(1);
  
  // Determine mode icon
  const getModeIcon = () => {
    switch (result.mode) {
      case 'flirty':
        return <Zap size={18} className="text-[#FF6B8B]" />;
      case 'developer':
      case 'python':
      case 'java':
      case 'csharp':
      case 'go':
        return <Code size={18} className="text-[#56C9CC]" />;
      default:
        return <Activity size={18} className="text-foreground" />;
    }
  };
  
  // Calculate performance grade based on WPM and accuracy
  const getGrade = () => {
    const score = (result.wpm * 0.7) + (result.accuracy * 0.3);
    
    if (score >= 90) return { grade: 'S+', color: '#FFD700' };
    if (score >= 80) return { grade: 'S', color: '#FFD700' };
    if (score >= 70) return { grade: 'A+', color: '#9ACD32' };
    if (score >= 60) return { grade: 'A', color: '#9ACD32' };
    if (score >= 50) return { grade: 'B+', color: '#3CB371' };
    if (score >= 40) return { grade: 'B', color: '#3CB371' };
    if (score >= 30) return { grade: 'C+', color: '#1E90FF' };
    if (score >= 20) return { grade: 'C', color: '#1E90FF' };
    return { grade: 'D', color: '#708090' };
  };
  
  const grade = getGrade();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-b from-background-secondary to-background max-w-lg border-accent/20">
        <DialogHeader className="flex flex-row justify-between items-center border-b border-accent/10 pb-3">
          <DialogTitle className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Award className="h-7 w-7 text-sky-400" /> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-500">FlexType</span>
          </DialogTitle>
          <DialogClose asChild>
            <button className="text-secondary hover:text-accent transition-colors">
              <X className="h-5 w-5" />
            </button>
          </DialogClose>
        </DialogHeader>
        
        {/* Performance Grade */}
        <div className="flex justify-center items-center mb-3">
          <div className="flex flex-col items-center bg-black/20 px-8 py-2 rounded-full">
            <div className="text-sm font-medium text-secondary">Performance</div>
            <div className="text-3xl font-bold" style={{ color: grade.color }}>{grade.grade}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="text-center p-4 bg-black/20 rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-50"></div>
            <Zap className="h-6 w-6 text-accent mb-1" />
            <p className="text-accent text-5xl font-bold mb-1 relative z-10">{animatedWpm}</p>
            <p className="text-secondary text-sm uppercase tracking-wide font-medium">WPM</p>
          </div>
          
          <div className="text-center p-4 bg-black/20 rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-50"></div>
            <BarChart className="h-6 w-6 text-green-500 mb-1" />
            <p className="text-green-500 text-5xl font-bold mb-1 relative z-10">{animatedAccuracy}%</p>
            <p className="text-secondary text-sm uppercase tracking-wide font-medium">accuracy</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-black/20 rounded-xl">
            <div className="flex justify-center mb-1">
              <Activity className="h-5 w-5 text-blue-400" />
            </div>
            <p className="text-blue-400 text-2xl font-bold mb-1">{animatedChars}</p>
            <p className="text-secondary text-xs uppercase tracking-wide">keystrokes</p>
          </div>
          
          <div className="text-center p-3 bg-black/20 rounded-xl">
            <div className="flex justify-center mb-1">
              <Check className="h-5 w-5 text-emerald-400" />
            </div>
            <p className="text-emerald-400 text-2xl font-bold mb-1">{animatedCorrect}</p>
            <p className="text-secondary text-xs uppercase tracking-wide">correct</p>
          </div>
          
          <div className="text-center p-3 bg-black/20 rounded-xl">
            <div className="flex justify-center mb-1">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <p className="text-red-400 text-2xl font-bold mb-1">{animatedErrors}</p>
            <p className="text-secondary text-xs uppercase tracking-wide">errors</p>
          </div>
        </div>
        
        <div className="flex flex-row justify-between items-center mb-6 px-2 text-sm">
          <div className="flex items-center bg-black/20 px-3 py-1 rounded-lg">
            <Clock size={14} className="text-secondary mr-2" />
            <span className="text-foreground">{result.duration}s</span>
          </div>
          
          <div className="flex items-center bg-black/20 px-3 py-1 rounded-lg">
            {getModeIcon()}
            <span className="text-foreground ml-2">{formattedMode}</span>
          </div>
          
          <div className="flex items-center bg-black/20 px-3 py-1 rounded-lg">
            <Activity size={14} className="text-secondary mr-2" />
            <span className="text-foreground">Raw: {rawWpm}</span>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          <DialogClose asChild>
            <Button className="bg-gradient-to-r from-accent to-accent/80 text-background hover:brightness-110 transition-all duration-300 font-bold">
              Retry Test
            </Button>
          </DialogClose>
          
          <DialogClose asChild>
            <Button variant="outline" className="border-accent/20 hover:bg-accent/10 text-foreground font-medium">
              New Test
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
