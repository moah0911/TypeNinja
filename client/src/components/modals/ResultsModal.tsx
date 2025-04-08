import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { TypingTestResult } from "@/types";

interface ResultsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: TypingTestResult | null;
}

export function ResultsModal({ open, onOpenChange, result }: ResultsModalProps) {
  if (!result) return null;
  
  // Calculate raw WPM (without accuracy adjustment)
  const rawWpm = Math.round((result.characters / 5) / (result.duration / 60));
  
  // Calculate correct characters
  const correctChars = result.characters - result.errors;
  
  // Format mode for display 
  const formattedMode = result.mode.charAt(0).toUpperCase() + result.mode.slice(1);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background-secondary max-w-lg">
        <DialogHeader className="flex flex-row justify-between items-center">
          <DialogTitle className="text-2xl font-mono text-accent">Test Results</DialogTitle>
          <DialogClose asChild>
            <button className="text-secondary hover:text-accent transition-colors">
              <X className="h-5 w-5" />
            </button>
          </DialogClose>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div className="text-center p-3 bg-background/40 rounded-lg">
            <p className="text-accent text-5xl font-mono mb-1 font-bold">{result.wpm}</p>
            <p className="text-secondary text-sm uppercase tracking-wide">WPM</p>
          </div>
          
          <div className="text-center p-3 bg-background/40 rounded-lg">
            <p className="text-foreground text-5xl font-mono mb-1 font-bold">{result.accuracy}%</p>
            <p className="text-secondary text-sm uppercase tracking-wide">accuracy</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-2 bg-background/40 rounded-lg">
            <p className="text-foreground text-2xl font-mono mb-1">{result.characters}</p>
            <p className="text-secondary text-xs uppercase tracking-wide">characters</p>
          </div>
          
          <div className="text-center p-2 bg-background/40 rounded-lg">
            <p className="text-foreground text-2xl font-mono mb-1">{correctChars}</p>
            <p className="text-secondary text-xs uppercase tracking-wide">correct</p>
          </div>
          
          <div className="text-center p-2 bg-background/40 rounded-lg">
            <p className="text-foreground text-2xl font-mono mb-1">{result.errors}</p>
            <p className="text-secondary text-xs uppercase tracking-wide">errors</p>
          </div>
        </div>
        
        <div className="flex flex-row justify-between items-center mb-6 px-2 text-sm text-secondary">
          <div>
            <span className="font-mono mr-2">Duration:</span>
            <span className="text-foreground">{result.duration}s</span>
          </div>
          
          <div>
            <span className="font-mono mr-2">Mode:</span>
            <span className="text-foreground">{formattedMode}</span>
          </div>
          
          <div>
            <span className="font-mono mr-2">Raw WPM:</span>
            <span className="text-foreground">{rawWpm}</span>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          <DialogClose asChild>
            <Button className="bg-accent text-background font-mono hover:bg-accent/90">
              Retry Test
            </Button>
          </DialogClose>
          
          <DialogClose asChild>
            <Button variant="outline" className="bg-background text-foreground font-mono">
              New Test
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
