import { useState, useEffect } from 'react';

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
  const [showLanguages, setShowLanguages] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('developer'); // Default to JavaScript
  
  // Define programming languages for developer mode
  const languages = [
    { id: 'developer', name: 'JavaScript', color: '#F7DF1E' },
    { id: 'python', name: 'Python', color: '#3776AB' },
    { id: 'java', name: 'Java', color: '#B07219' },
    { id: 'csharp', name: 'C#', color: '#178600' },
    { id: 'go', name: 'Go', color: '#00ADD8' }
  ];
  
  // Show languages dropdown when developer mode is selected
  useEffect(() => {
    if (selectedMode.startsWith('developer') || 
        ['python', 'java', 'csharp', 'go'].includes(selectedMode)) {
      setShowLanguages(true);
      
      // Find the matching language when mode changes
      const language = languages.find(lang => lang.id === selectedMode);
      if (language) {
        setSelectedLanguage(selectedMode);
      } else {
        setSelectedLanguage('developer'); // Default to JavaScript if not found
      }
    } else {
      setShowLanguages(false);
    }
  }, [selectedMode]);
  
  // Handle language selection
  const handleLanguageChange = (languageId: string) => {
    setSelectedLanguage(languageId);
    onModeChange(languageId);
  };
  
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
          className={`relative cursor-pointer mode-indicator 
            ${selectedMode === 'developer' || 
              selectedMode === 'python' || 
              selectedMode === 'java' || 
              selectedMode === 'csharp' || 
              selectedMode === 'go' ? 'active dev-active' : ''}`}
          onClick={() => onModeChange(selectedLanguage || 'developer')}
        >
          <span className={`font-mono 
            ${selectedMode === 'developer' || 
              selectedMode === 'python' || 
              selectedMode === 'java' || 
              selectedMode === 'csharp' || 
              selectedMode === 'go' ? 'text-[#56C9CC]' : 'text-secondary hover:text-[#56C9CC] transition-colors'}`}>
            Developer
          </span>
        </div>
      </div>
      
      {/* Language Selector (only visible when Developer mode is selected) */}
      {showLanguages && (
        <div className="flex justify-center space-x-4 mt-2 mb-4">
          {languages.map(language => (
            <button
              key={language.id}
              className={`py-1 px-3 rounded bg-background-secondary
                ${selectedLanguage === language.id ? 'border-2' : 'border border-transparent'} 
                transition-colors text-sm font-mono`}
              style={{ 
                color: selectedLanguage === language.id ? language.color : 'var(--color-text-secondary)',
                borderColor: selectedLanguage === language.id ? language.color : 'transparent'
              }}
              onClick={() => handleLanguageChange(language.id)}
            >
              {language.name}
            </button>
          ))}
        </div>
      )}
      
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
