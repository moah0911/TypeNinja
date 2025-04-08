import { useState } from "react";
import Header from "@/components/Header";
import TypingTest from "@/components/typing/TypingTest";
import { ResultsModal } from "@/components/modals/ResultsModal";
import { FlirtyModePreview } from "@/components/modals/FlirtyModePreview"; 
import { DeveloperModePreview } from "@/components/modals/DeveloperModePreview";
import { TypingTestResult } from "@/types";

export default function Home() {
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [flirtyPreviewOpen, setFlirtyPreviewOpen] = useState(false);
  const [devPreviewOpen, setDevPreviewOpen] = useState(false);
  const [testResult, setTestResult] = useState<TypingTestResult | null>(null);

  const handleTestComplete = (result: TypingTestResult) => {
    setTestResult(result);
    setResultModalOpen(true);
  };

  const handleOpenModePreview = (mode: string) => {
    if (mode === "flirty") {
      setFlirtyPreviewOpen(true);
    } else if (mode === "developer") {
      setDevPreviewOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <TypingTest 
          onTestComplete={handleTestComplete} 
          onModePreviewRequest={handleOpenModePreview}
        />
      </main>
      
      <ResultsModal 
        open={resultModalOpen} 
        onOpenChange={setResultModalOpen} 
        result={testResult} 
      />
      
      <FlirtyModePreview 
        open={flirtyPreviewOpen} 
        onOpenChange={setFlirtyPreviewOpen} 
      />
      
      <DeveloperModePreview 
        open={devPreviewOpen} 
        onOpenChange={setDevPreviewOpen} 
      />
    </div>
  );
}
