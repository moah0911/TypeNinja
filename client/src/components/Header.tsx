import { Link, useLocation } from "wouter";
import { Keyboard, Zap, Code } from "lucide-react";

export default function Header() {
  // Use this to navigate programmatically
  const [_, navigate] = useLocation();
  
  // Function to handle click on logo instead of using the Link component
  const navigateToHome = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
  };
  
  return (
    <header className="py-4 px-6 flex justify-between items-center bg-gradient-to-r from-background to-background-secondary border-b border-accent/10">
      {/* Logo */}
      <div className="flex items-center">
        <div 
          onClick={navigateToHome}
          className="flex items-center gap-3 hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Keyboard className="h-8 w-8 text-sky-400 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-500">FlexType</span>
            <span className="text-xs text-secondary leading-none mt-1">Master the keyboard, showcase your skills</span>
          </div>
        </div>
      </div>
      
      {/* Mode indicators */}
      <div className="hidden md:flex items-center space-x-6">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/20 shadow-sm hover:bg-black/30 transition-colors">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-secondary text-sm font-medium">Normal</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full hover:bg-black/10 transition-colors">
          <Zap className="h-4 w-4 text-pink-500" />
          <span className="text-secondary text-sm font-medium">Flirty</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full hover:bg-black/10 transition-colors">
          <Code className="h-4 w-4 text-cyan-500" />
          <span className="text-secondary text-sm font-medium">Developer</span>
        </div>
      </div>
    </header>
  );
}
