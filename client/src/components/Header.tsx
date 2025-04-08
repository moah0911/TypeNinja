import { Link, useLocation } from "wouter";
import { History, Settings, User } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HeaderProps {
  onSettingsClick?: () => void;
}

export default function Header({ onSettingsClick }: HeaderProps) {
  const [location] = useLocation();
  
  return (
    <header className="p-4 flex justify-between items-center">
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/">
          <a className="text-accent font-mono text-xl font-semibold">TypeMaster</a>
        </Link>
      </div>
      
      {/* Controls */}
      <div className="flex items-center space-x-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/history">
                <a className={`${location === '/history' ? 'text-accent' : 'text-secondary hover:text-accent'} transition-colors`}>
                  <History className="h-5 w-5" />
                </a>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>View test history</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="text-secondary hover:text-accent transition-colors"
                onClick={onSettingsClick}
              >
                <Settings className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-secondary hover:text-accent transition-colors">
                <User className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>User account</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
}
