interface ModeSelectorProps {
  selectedMode: string;
  selectedDuration: number;
  onModeChange: (mode: string) => void;
  onDurationChange: (duration: number) => void;
}

export default function ModeSelector({
  selectedMode,
  selectedDuration,
  onModeChange,
  onDurationChange
}: ModeSelectorProps) {
  const durations = [15, 30, 60, 120];
  
  return (
    <div className="w-full max-w-3xl mb-8">
      {/* Mode Selector */}
      <div className="flex space-x-8 justify-center mb-4">
        <div 
          className={`relative cursor-pointer mode-indicator ${selectedMode === 'normal' ? 'active' : ''}`}
          onClick={() => onModeChange('normal')}
        >
          <span className={`font-mono ${selectedMode === 'normal' ? 'text-accent' : 'text-secondary hover:text-accent transition-colors'}`}>
            Normal
          </span>
        </div>
        
        <div 
          className={`relative cursor-pointer mode-indicator ${selectedMode === 'flirty' ? 'active flirty-active' : ''}`}
          onClick={() => onModeChange('flirty')}
        >
          <span className={`font-mono ${selectedMode === 'flirty' ? 'text-[#FF6B8B]' : 'text-secondary hover:text-[#FF6B8B] transition-colors'}`}>
            Flirty
          </span>
        </div>
        
        <div 
          className={`relative cursor-pointer mode-indicator ${selectedMode === 'developer' ? 'active dev-active' : ''}`}
          onClick={() => onModeChange('developer')}
        >
          <span className={`font-mono ${selectedMode === 'developer' ? 'text-[#56C9CC]' : 'text-secondary hover:text-[#56C9CC] transition-colors'}`}>
            Developer
          </span>
        </div>
      </div>
      
      {/* Duration Selector */}
      <div className="flex justify-center space-x-4 mt-2">
        {durations.map(duration => (
          <button
            key={duration}
            className={`py-1 px-3 rounded bg-background-secondary 
              ${selectedDuration === duration ? 'text-accent' : 'text-secondary hover:text-accent'} 
              transition-colors text-sm font-mono`}
            onClick={() => onDurationChange(duration)}
          >
            {duration}s
          </button>
        ))}
      </div>
    </div>
  );
}
