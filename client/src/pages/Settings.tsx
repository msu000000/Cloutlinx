import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Lock, CreditCard, Download, Trash2, ExternalLink } from "lucide-react";

export default function Settings() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

  // Password update mutation
  const updatePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await apiRequest("POST", "/api/update-password", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Password updated successfully.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update password",
        variant: "destructive",
      });
    },
  });

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "New password and confirmation must match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    updatePasswordMutation.mutate({ currentPassword, newPassword });
  };

  const handleExportData = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Data export functionality will be available soon.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Account deletion functionality will be available soon.",
      variant: "destructive",
    });
  };

  const handleStripePortal = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Stripe customer portal will be available soon.",
    });
  };

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
        return 'Basic';
      case 'pro':
        return 'Pro';
      default:
        return 'Free';
    }
  };

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2" data-testid="settings-title">Settings</h1>
          <p className="text-muted-foreground" data-testid="settings-description">Manage your account preferences</p>
        </div>

        <div className="space-y-8">
          {/* Password Change */}
          <Card data-testid="password-section">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="mr-2 h-5 w-5" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="mt-2"
                    data-testid="input-current-password"
                  />
                </div>
                
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-2"
                    data-testid="input-new-password"
                  />
                </div>
                
                <div>
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-2"
                    data-testid="input-confirm-password"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={updatePasswordMutation.isPending}
                  data-testid="button-update-password"
                >
                  {updatePasswordMutation.isPending ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Subscription Management */}
          <Card data-testid="subscription-section">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Subscription Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted border border-border">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground" data-testid="subscription-plan">
                        Current Plan: {getPlanDisplayName(user.subscriptionTier)}
                      </p>
                      <Badge variant={user.subscriptionTier === 'free' ? 'secondary' : 'default'}>
                        {user.subscriptionTier === 'pro' ? 'Unlimited' : 
                         user.subscriptionTier === 'basic' ? '10 hooks/month' : '2 hooks/month'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {user.subscriptionTier === 'free' 
                        ? 'No active subscription' 
                        : 'Active subscription'
                      }
                    </p>
                  </div>
                  
                  {user.subscriptionTier === 'free' ? (
                    <Button asChild data-testid="button-subscribe">
                      <Link href="/pricing">Subscribe</Link>
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={handleStripePortal}
                      data-testid="button-manage-subscription"
                    >
                      Manage Subscription
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                {user.subscriptionTier !== 'free' && (
                  <div className="text-sm text-muted-foreground">
                    <p>Manage your subscription, update payment methods, and view billing history through the customer portal.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card data-testid="account-actions">
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  onClick={handleExportData}
                  className="w-full justify-start"
                  data-testid="button-export-data"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Account Data
                </Button>
                
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAccount}
                  className="w-full justify-start"
                  data-testid="button-delete-account"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
