import { Link } from "wouter";
import { Keyboard, Zap, Code } from "lucide-react";

export default function Header() {
  return (
    <header className="py-4 px-6 flex justify-between items-center bg-gradient-to-r from-background to-background-secondary border-b border-accent/10">
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/">
          <div className="flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer">
            <Keyboard className="h-7 w-7 text-accent" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent/80">Type Your Flex</span>
              <span className="text-xs text-secondary leading-none">Type faster, code better</span>
            </div>
          </div>
        </Link>
      </div>
      
      {/* Mode indicators */}
      <div className="hidden md:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/20">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-secondary text-sm">Normal</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full">
          <Zap className="h-4 w-4 text-[#FF6B8B]" />
          <span className="text-secondary text-sm">Flirty</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full">
          <Code className="h-4 w-4 text-[#56C9CC]" />
          <span className="text-secondary text-sm">Developer</span>
        </div>
      </div>
    </header>
  );
}
