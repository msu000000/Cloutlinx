import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { User, Calendar, TrendingUp, Zap } from "lucide-react";

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect via useEffect
  }

  const getPlanDisplayName = (tier: string) => {
    switch (tier) {
      case 'basic':
        return 'Basic Plan';
      case 'pro':
        return 'Pro Plan';
      default:
        return 'Free Plan';
    }
  };

  const getUsagePercentage = () => {
    if (!user.hooksLimit || user.hooksLimit === -1) return 0;
    return Math.min(100, (user.hooksUsed / user.hooksLimit) * 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2" data-testid="profile-title">Profile</h1>
          <p className="text-muted-foreground" data-testid="profile-description">Manage your account information</p>
        </div>

        <div className="space-y-6">
          {/* Account Information */}
          <Card data-testid="account-info">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                <div className="px-4 py-3 bg-muted border border-input text-foreground" data-testid="user-email">
                  {user.email || 'Not provided'}
                </div>
              </div>

              {(user.firstName || user.lastName) && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                  <div className="px-4 py-3 bg-muted border border-input text-foreground" data-testid="user-name">
                    {`${user.firstName || ''} ${user.lastName || ''}`.trim()}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Member Since</label>
                <div className="px-4 py-3 bg-muted border border-input text-foreground" data-testid="member-since">
                  {formatDate(user.createdAt)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription */}
          <Card data-testid="subscription-info">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between px-4 py-3 bg-muted border border-input">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground" data-testid="current-plan">
                      {getPlanDisplayName(user.subscriptionTier)}
                    </span>
                    <Badge variant={user.subscriptionTier === 'free' ? 'secondary' : 'default'}>
                      {user.subscriptionTier === 'pro' ? 'Unlimited' : `${user.hooksLimit} hooks/month`}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {user.subscriptionTier === 'free' 
                      ? 'Perfect for getting started' 
                      : user.subscriptionTier === 'basic'
                      ? 'Great for regular creators'
                      : 'For serious content creators'
                    }
                  </p>
                </div>
                {user.subscriptionTier === 'free' && (
                  <Button asChild size="sm" data-testid="button-upgrade">
                    <Link href="/pricing">Upgrade</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Usage Statistics */}
          <Card data-testid="usage-stats">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5" />
                Usage This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-foreground">Hooks Generated</span>
                  <span className="font-semibold" data-testid="hooks-used">
                    {user.hooksUsed} / {user.hooksLimit === -1 ? '∞' : user.hooksLimit}
                  </span>
                </div>
                
                {user.hooksLimit !== -1 && (
                  <div className="space-y-2">
                    <Progress 
                      value={getUsagePercentage()} 
                      className="w-full" 
                      data-testid="usage-progress"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Usage</span>
                      <span>{Math.round(getUsagePercentage())}%</span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Resets on</span>
                  <span className="text-foreground" data-testid="reset-date">
                    {formatDate(user.resetDate || user.createdAt)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card data-testid="quick-actions">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full justify-start" data-testid="button-dashboard">
                <Link href="/dashboard">
                  <Zap className="mr-2 h-4 w-4" />
                  Generate New Hooks
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full justify-start" data-testid="button-settings">
                <Link href="/settings">
                  <User className="mr-2 h-4 w-4" />
                  Account Settings
                </Link>
              </Button>
              
              {user.subscriptionTier === 'free' && (
                <Button asChild className="w-full justify-start" data-testid="button-upgrade-plan">
                  <Link href="/pricing">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Upgrade Plan
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
