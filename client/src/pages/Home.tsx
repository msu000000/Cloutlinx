import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight, Zap, TrendingUp, Target } from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Welcome Section */}
      <div className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6" data-testid="welcome-title">
              Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8" data-testid="welcome-description">
              Ready to create viral hooks that capture attention and drive engagement? 
              Let's get started with your content creation journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="w-full sm:w-auto" data-testid="button-create-hooks">
                <Link href="/dashboard">
                  Create Hooks Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto" data-testid="button-view-profile">
                <Link href="/profile">
                  View Profile
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="py-16 bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-card border border-border p-6" data-testid="stat-plan">
              <div className="text-2xl font-bold text-primary mb-2">
                {user?.subscriptionTier === 'free' ? 'Free' : 
                 user?.subscriptionTier === 'basic' ? 'Basic' : 'Pro'}
              </div>
              <div className="text-muted-foreground">Current Plan</div>
            </div>
            <div className="bg-card border border-border p-6" data-testid="stat-hooks">
              <div className="text-2xl font-bold text-primary mb-2">
                {user?.hooksUsed || 0}
              </div>
              <div className="text-muted-foreground">Hooks Used This Month</div>
            </div>
            <div className="bg-card border border-border p-6" data-testid="stat-limit">
              <div className="text-2xl font-bold text-primary mb-2">
                {user?.hooksLimit === -1 ? '∞' : user?.hooksLimit || 2}
              </div>
              <div className="text-muted-foreground">Monthly Limit</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12" data-testid="quick-actions-title">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/dashboard" className="group">
              <div className="bg-card border border-border p-8 hover:border-primary transition-colors" data-testid="action-generate">
                <Zap className="text-3xl text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Generate New Hooks</h3>
                <p className="text-muted-foreground">Create viral hooks for your next TikTok or Instagram Reel</p>
                <ArrowRight className="mt-4 text-primary group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            
            <Link href="/pricing" className="group">
              <div className="bg-card border border-border p-8 hover:border-primary transition-colors" data-testid="action-upgrade">
                <TrendingUp className="text-3xl text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Upgrade Plan</h3>
                <p className="text-muted-foreground">Get more hooks and unlock advanced features</p>
                <ArrowRight className="mt-4 text-primary group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
