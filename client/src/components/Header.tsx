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
    <header className="py-4 px-6 flex justify-between items-center backdrop-blur-md bg-black/20 border-b border-sky-500/10 z-20 relative">
      {/* Glass effect behind the header */}
      <div className="absolute inset-0 bg-gradient-to-r from-sky-900/5 to-indigo-900/5 z-0"></div>
      
      {/* Logo */}
      <div className="flex items-center relative z-10">
        <div 
          onClick={navigateToHome}
          className="flex items-center gap-3 hover:opacity-90 transition-all duration-300 cursor-pointer group"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/30 to-indigo-500/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Keyboard className="h-9 w-9 text-sky-400 relative z-10 transition-transform duration-300 group-hover:scale-110" />
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-500">FlexType</span>
            <span className="text-xs text-sky-200/80 leading-none mt-1 tracking-wide">Master the keyboard, showcase your skills</span>
          </div>
        </div>
      </div>
      
      {/* Mode indicators */}
      <div className="hidden md:flex items-center space-x-4 relative z-10">
        <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-500/20 shadow-md hover:shadow-lg hover:border-green-500/30 transition-all duration-300">
          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse shadow-glow"></div>
          <span className="text-green-200 text-sm font-medium">Normal</span>
        </div>
        <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-black/10 border border-transparent hover:border-pink-500/20 hover:bg-gradient-to-r hover:from-pink-500/10 hover:to-pink-500/5 transition-all duration-300">
          <Zap className="h-4 w-4 text-pink-400" />
          <span className="text-pink-200/80 text-sm font-medium">Flirty</span>
        </div>
        <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-black/10 border border-transparent hover:border-cyan-500/20 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-cyan-500/5 transition-all duration-300">
          <Code className="h-4 w-4 text-cyan-400" />
          <span className="text-cyan-200/80 text-sm font-medium">Developer</span>
        </div>
      </div>
    </header>
  );
}
