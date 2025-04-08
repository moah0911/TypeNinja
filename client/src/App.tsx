import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import History from "@/pages/History";
import NotFound from "@/pages/not-found";
import { SettingsProvider } from "@/lib/hooks/useSettings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/history" component={History} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <Router />
        <Toaster />
      </SettingsProvider>
    </QueryClientProvider>
  );
}

export default App;
