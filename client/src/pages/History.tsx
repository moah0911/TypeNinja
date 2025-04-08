import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TypingTest } from "@shared/schema";
import { format } from "date-fns";
import { ChevronLeft, Loader2 } from "lucide-react";

export default function History() {
  const { data: tests, isLoading } = useQuery<TypingTest[]>({
    queryKey: ['/api/typing-tests'],
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center p-4 md:p-8">
        <div className="w-full max-w-3xl">
          <div className="flex items-center mb-6">
            <Link href="/">
              <a className="flex items-center text-accent hover:opacity-80 transition-opacity">
                <ChevronLeft className="h-5 w-5 mr-1" />
                <span>Back to Test</span>
              </a>
            </Link>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-accent font-mono text-2xl">
                Test History
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 text-accent animate-spin" />
                </div>
              ) : tests && tests.length > 0 ? (
                <div className="space-y-4">
                  {tests.map((test) => (
                    <TestHistoryItem key={test.id} test={test} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  You haven't completed any tests yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

function TestHistoryItem({ test }: { test: TypingTest }) {
  // Format the date string
  const formattedDate = format(
    new Date(test.timestamp),
    "MMM d, yyyy 'at' h:mm a"
  );
  
  // Determine the mode color
  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'flirty': return 'text-[#FF6B8B]';
      case 'developer': return 'text-[#56C9CC]';
      default: return 'text-accent';
    }
  };
  
  return (
    <div className="bg-background p-4 rounded-md">
      <div className="flex flex-wrap justify-between gap-2">
        <div className="text-lg font-mono">
          <span className="text-accent">{test.wpm}</span> WPM
        </div>
        <div className={`font-mono uppercase text-sm ${getModeColor(test.mode)}`}>
          {test.mode} mode • {test.duration}s
        </div>
      </div>
      
      <Separator className="my-2" />
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-3">
        <div>
          <div className="text-muted-foreground text-xs">ACCURACY</div>
          <div className="font-mono">{test.accuracy}%</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">CHARACTERS</div>
          <div className="font-mono">{test.characters}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">ERRORS</div>
          <div className="font-mono">{test.errors}</div>
        </div>
      </div>
      
      <div className="mt-3 text-xs text-muted-foreground">
        {formattedDate}
      </div>
    </div>
  );
}
