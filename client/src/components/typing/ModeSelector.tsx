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
      <div className="flex justify-center space-x-8 mb-5">
        <div 
          className={`relative cursor-pointer mode-indicator group`}
          onClick={() => onModeChange('normal')}
        >
          <div className={`flex flex-col items-center px-6 py-2 rounded-lg transition-all duration-300
            ${selectedMode === 'normal' 
              ? 'bg-gradient-to-r from-sky-500/20 to-indigo-500/20 shadow-lg border border-sky-500/20' 
              : 'hover:bg-black/10 border border-transparent'}`}>
            <span className={`font-medium text-base
              ${selectedMode === 'normal' 
                ? 'text-sky-400' 
                : 'text-secondary group-hover:text-sky-400 transition-colors'}`}>
              Normal
            </span>
            {selectedMode === 'normal' && (
              <div className="w-10 h-0.5 bg-gradient-to-r from-sky-400 to-indigo-400 rounded-full mt-1.5"></div>
            )}
          </div>
        </div>
        
        <div 
          className={`relative cursor-pointer mode-indicator group`}
          onClick={() => onModeChange('flirty')}
        >
          <div className={`flex flex-col items-center px-6 py-2 rounded-lg transition-all duration-300
            ${selectedMode === 'flirty' 
              ? 'bg-gradient-to-r from-pink-500/20 to-red-500/20 shadow-lg border border-pink-500/20' 
              : 'hover:bg-black/10 border border-transparent'}`}>
            <span className={`font-medium text-base
              ${selectedMode === 'flirty' 
                ? 'text-pink-400' 
                : 'text-secondary group-hover:text-pink-400 transition-colors'}`}>
              Flirty
            </span>
            {selectedMode === 'flirty' && (
              <div className="w-10 h-0.5 bg-gradient-to-r from-pink-400 to-red-400 rounded-full mt-1.5"></div>
            )}
          </div>
        </div>
        
        <div 
          className={`relative cursor-pointer mode-indicator group`}
          onClick={() => onModeChange(selectedLanguage || 'developer')}
        >
          <div className={`flex flex-col items-center px-6 py-2 rounded-lg transition-all duration-300
            ${selectedMode === 'developer' || 
              selectedMode === 'python' || 
              selectedMode === 'java' || 
              selectedMode === 'csharp' || 
              selectedMode === 'go'
              ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 shadow-lg border border-teal-500/20' 
              : 'hover:bg-black/10 border border-transparent'}`}>
            <span className={`font-medium text-base
              ${selectedMode === 'developer' || 
                selectedMode === 'python' || 
                selectedMode === 'java' || 
                selectedMode === 'csharp' || 
                selectedMode === 'go' 
                ? 'text-teal-400' 
                : 'text-secondary group-hover:text-teal-400 transition-colors'}`}>
              Developer
            </span>
            {(selectedMode === 'developer' || 
              selectedMode === 'python' || 
              selectedMode === 'java' || 
              selectedMode === 'csharp' || 
              selectedMode === 'go') && (
              <div className="w-10 h-0.5 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full mt-1.5"></div>
            )}
          </div>
        </div>
      </div>
      
      {/* Language Selector (only visible when Developer mode is selected) */}
      {showLanguages && (
        <div className="flex justify-center space-x-3 mt-1 mb-5">
          {languages.map(language => (
            <button
              key={language.id}
              className={`py-2 px-4 rounded-lg transition-all duration-200
                ${selectedLanguage === language.id 
                  ? 'shadow-md' 
                  : 'hover:bg-black/10 bg-black/5'} 
                text-sm font-medium`}
              style={{ 
                color: selectedLanguage === language.id ? language.color : 'var(--color-text-secondary)',
                backgroundColor: selectedLanguage === language.id ? `${language.color}15` : '', // 15 is hex for 10% opacity
                borderLeft: selectedLanguage === language.id ? `3px solid ${language.color}` : ''
              }}
              onClick={() => handleLanguageChange(language.id)}
            >
              {language.name}
            </button>
          ))}
        </div>
      )}
      
      {/* Duration Selector */}
      <div className="flex justify-center space-x-3 mt-2">
        <div className="bg-black/10 p-1 rounded-lg inline-flex shadow-inner">
          {durations.map(duration => (
            <button
              key={duration}
              className={`py-1.5 px-4 rounded-md text-sm font-medium transition-all duration-200
                ${selectedDuration === duration 
                  ? 'bg-gradient-to-r from-sky-500/30 to-indigo-500/30 text-white shadow-sm' 
                  : 'text-secondary hover:text-sky-200'}`}
              onClick={() => onDurationChange(duration)}
            >
              {duration}s
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
