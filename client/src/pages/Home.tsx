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
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c121d] via-background to-background z-0"></div>
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-sky-900/20 to-transparent opacity-40 z-0"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-sky-500/10 filter blur-3xl"></div>
      <div className="absolute top-1/4 -right-24 w-96 h-96 rounded-full bg-indigo-500/10 filter blur-3xl"></div>
      <div className="absolute -bottom-24 left-1/3 w-96 h-96 rounded-full bg-cyan-500/10 filter blur-3xl"></div>
      
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative z-10">
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
