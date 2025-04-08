import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FlirtyModePreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FlirtyModePreview({ open, onOpenChange }: FlirtyModePreviewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background-secondary max-w-2xl">
        <DialogHeader className="flex flex-row justify-between items-center">
          <DialogTitle className="text-2xl font-mono text-[#FF6B8B]">Flirty Mode</DialogTitle>
          <DialogClose asChild>
            <button className="text-secondary hover:text-[#FF6B8B] transition-colors">
              <X className="h-5 w-5" />
            </button>
          </DialogClose>
        </DialogHeader>
        
        <div className="font-mono text-lg leading-relaxed text-secondary bg-background p-5 rounded-lg mb-4">
          <p>In flirty mode, you'll type romantic and flirtatious quotes to improve your typing skills.</p>
          <p className="text-[#FF6B8B] mt-4">Example: "Your eyes are like stars, shining brightly in the night sky, guiding me home."</p>
        </div>
        
        <div className="flex justify-center">
          <DialogClose asChild>
            <Button 
              className="bg-[#FF6B8B] text-background font-mono hover:bg-[#FF6B8B]/90"
            >
              Start Flirty Mode
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
