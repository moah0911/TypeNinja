import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface DeveloperModePreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeveloperModePreview({ open, onOpenChange }: DeveloperModePreviewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background-secondary max-w-2xl">
        <DialogHeader className="flex flex-row justify-between items-center">
          <DialogTitle className="text-2xl font-mono text-[#56C9CC]">Developer Mode</DialogTitle>
          <DialogClose asChild>
            <button className="text-secondary hover:text-[#56C9CC] transition-colors">
              <X className="h-5 w-5" />
            </button>
          </DialogClose>
        </DialogHeader>
        
        <div className="font-mono text-lg leading-relaxed text-secondary bg-background p-5 rounded-lg mb-4">
          <p>In developer mode, you'll type real code snippets to improve your programming typing speed.</p>
          <p className="text-[#56C9CC] mt-4 text-sm">Example:</p>
          <pre className="bg-[#1E1E2E] p-3 rounded mt-2 text-sm overflow-x-auto">
{`function calculateWPM(typedChars, timeInSeconds) {
  const minutes = timeInSeconds / 60;
  const words = typedChars / 5; // Standard: 5 chars = 1 word
  return Math.round(words / minutes);
}`}
          </pre>
        </div>
        
        <div className="flex justify-center">
          <DialogClose asChild>
            <Button 
              className="bg-[#56C9CC] text-background font-mono hover:bg-[#56C9CC]/90"
            >
              Start Developer Mode
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
