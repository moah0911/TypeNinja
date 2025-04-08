import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSettings } from "@/lib/hooks/useSettings";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { settings, updateSettings } = useSettings();
  const [tempSettings, setTempSettings] = useState(settings);
  
  const handleSettingChange = (key: string, value: any) => {
    setTempSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const saveSettings = () => {
    updateSettings(tempSettings);
    onOpenChange(false);
  };
  
  // Theme options
  const themes = [
    { name: "Default", value: "default", bgColor: "bg-background" },
    { name: "Rosé Pine", value: "rosepine", bgColor: "bg-[#232136]" },
    { name: "Catppuccin", value: "catppuccin", bgColor: "bg-[#1E1E2E]" },
    { name: "Gruvbox", value: "gruvbox", bgColor: "bg-[#2D2A2E]" }
  ];
  
  // Caret styles
  const caretStyles = [
    { name: "Line", value: "line" },
    { name: "Block", value: "block" },
    { name: "Underline", value: "underline" }
  ];
  
  // Font options
  const fonts = [
    { name: "Roboto Mono", value: "Roboto Mono" },
    { name: "Fira Code", value: "Fira Code" },
    { name: "JetBrains Mono", value: "JetBrains Mono" },
    { name: "Source Code Pro", value: "Source Code Pro" }
  ];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background-secondary max-w-2xl h-[85vh] overflow-y-auto">
        <DialogHeader className="flex flex-row justify-between items-center">
          <DialogTitle className="text-2xl font-mono text-accent">Settings</DialogTitle>
          <DialogClose asChild>
            <button className="text-secondary hover:text-accent transition-colors">
              <X className="h-5 w-5" />
            </button>
          </DialogClose>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Theme Settings */}
          <div>
            <h3 className="text-foreground font-medium mb-3">Theme</h3>
            <div className="grid grid-cols-4 gap-3">
              {themes.map((theme) => (
                <div
                  key={theme.value}
                  className={`h-12 ${theme.bgColor} rounded cursor-pointer ${
                    tempSettings.theme === theme.value 
                      ? 'border-2 border-accent' 
                      : 'border border-border'
                  }`}
                  onClick={() => handleSettingChange('theme', theme.value)}
                />
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Sound Settings */}
          <div>
            <h3 className="text-foreground font-medium mb-3">Sound</h3>
            <div className="flex items-center justify-between">
              <span className="text-secondary">Keyboard Sounds</span>
              <Switch
                checked={tempSettings.soundEnabled}
                onCheckedChange={(checked) => 
                  handleSettingChange('soundEnabled', checked)
                }
              />
            </div>
          </div>
          
          <Separator />
          
          {/* Caret Settings */}
          <div>
            <h3 className="text-foreground font-medium mb-3">Caret</h3>
            <div className="grid grid-cols-3 gap-3">
              {caretStyles.map((style) => (
                <Button
                  key={style.value}
                  variant={tempSettings.caretStyle === style.value ? "default" : "outline"}
                  className={
                    tempSettings.caretStyle === style.value
                      ? "bg-accent text-background hover:bg-accent/90"
                      : "bg-background text-secondary hover:text-accent"
                  }
                  onClick={() => handleSettingChange('caretStyle', style.value)}
                >
                  {style.name}
                </Button>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Font Settings */}
          <div>
            <h3 className="text-foreground font-medium mb-3">Font</h3>
            <div className="grid grid-cols-2 gap-3">
              {fonts.map((font) => (
                <Button
                  key={font.value}
                  variant={tempSettings.fontFamily === font.value ? "default" : "outline"}
                  className={
                    tempSettings.fontFamily === font.value
                      ? "bg-accent text-background hover:bg-accent/90"
                      : "bg-background text-secondary hover:text-accent"
                  }
                  onClick={() => handleSettingChange('fontFamily', font.value)}
                >
                  {font.name}
                </Button>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Other Settings */}
          <div>
            <h3 className="text-foreground font-medium mb-3">Other</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-secondary">Show Keyboard</span>
                <Switch
                  checked={tempSettings.showKeyboard}
                  onCheckedChange={(checked) => 
                    handleSettingChange('showKeyboard', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary">Show Live WPM</span>
                <Switch
                  checked={tempSettings.showLiveWpm}
                  onCheckedChange={(checked) => 
                    handleSettingChange('showLiveWpm', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary">Smooth Caret</span>
                <Switch
                  checked={tempSettings.smoothCaret}
                  onCheckedChange={(checked) => 
                    handleSettingChange('smoothCaret', checked)
                  }
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button
              className="bg-accent text-background hover:bg-accent/90"
              onClick={saveSettings}
            >
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
