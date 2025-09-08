import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Pricing from "@/pages/Pricing";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/pricing" component={Pricing} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          {isLoading || !isAuthenticated ? (
            <Route path="/" component={Landing} />
          ) : (
            <>
              <Route path="/" component={Dashboard} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/profile" component={Profile} />
              <Route path="/settings" component={Settings} />
            </>
          )}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
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
