import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Calculator, History as HistoryIcon } from "lucide-react";
import JafrCalculator from "@/pages/jafr-calculator";
import History from "@/pages/history";

function Navigation() {
  const [location] = useLocation();
  
  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8 rtl:space-x-reverse">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              نظام الجفر الذكي
            </h1>
          </div>
          
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Link href="/">
              <Button 
                variant={location === "/" ? "default" : "ghost"}
                className="flex items-center gap-2"
              >
                <Calculator className="h-4 w-4" />
                <span>حاسبة الجفر</span>
              </Button>
            </Link>
            
            <Link href="/history">
              <Button 
                variant={location === "/history" ? "default" : "ghost"}
                className="flex items-center gap-2"
              >
                <HistoryIcon className="h-4 w-4" />
                <span>السجل</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Router() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <Switch>
        <Route path="/" component={JafrCalculator} />
        <Route path="/history" component={History} />
        <Route component={JafrCalculator} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
