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
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="text-center">
            <p className="text-accent text-4xl font-mono mb-1">{result.wpm}</p>
            <p className="text-secondary text-sm uppercase tracking-wide">WPM</p>
          </div>
          
          <div className="text-center">
            <p className="text-foreground text-4xl font-mono mb-1">{result.accuracy}%</p>
            <p className="text-secondary text-sm uppercase tracking-wide">accuracy</p>
          </div>
          
          <div className="text-center">
            <p className="text-foreground text-4xl font-mono mb-1">{result.characters}</p>
            <p className="text-secondary text-sm uppercase tracking-wide">characters</p>
          </div>
          
          <div className="text-center">
            <p className="text-foreground text-4xl font-mono mb-1">{result.errors}</p>
            <p className="text-secondary text-sm uppercase tracking-wide">errors</p>
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
