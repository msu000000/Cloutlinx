import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, Wand2, Loader2, AlertCircle } from "lucide-react";

interface Hook {
  id: string;
  content: string;
  style: string;
  topic: string;
  createdAt: string;
}

const HOOK_STYLES = [
  { value: "bold-statement", label: "Bold Statement" },
  { value: "relatable-pain", label: "Relatable Pain" },
  { value: "curiosity", label: "Curiosity" },
  { value: "transformation", label: "Transformation" },
  { value: "storytelling", label: "Storytelling" },
];

const PLATFORMS = [
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram Reels" },
  { value: "youtube", label: "YouTube Shorts" },
  { value: "all", label: "All Platforms" },
];

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("bold-statement");
  const [platform, setPlatform] = useState("all");
  const [generatedHooks, setGeneratedHooks] = useState<Hook[]>([]);

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

  // Generate hooks mutation
  const generateHooksMutation = useMutation({
    mutationFn: async (data: { topic: string; style: string; platform: string }) => {
      const response = await apiRequest("POST", "/api/generate-hooks", data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedHooks(data.hooks);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Hooks Generated!",
        description: `Successfully generated ${data.hooks.length} viral hooks.`,
      });
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
        description: error instanceof Error ? error.message : "Failed to generate hooks",
        variant: "destructive",
      });
    },
  });

  const handleGenerateHooks = () => {
    if (!topic.trim()) {
      toast({
        title: "Missing Topic",
        description: "Please enter a topic for your hooks.",
        variant: "destructive",
      });
      return;
    }

    generateHooksMutation.mutate({ topic: topic.trim(), style, platform });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Hook copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy hook to clipboard.",
        variant: "destructive",
      });
    }
  };

  const getStyleLabel = (styleValue: string) => {
    return HOOK_STYLES.find(s => s.value === styleValue)?.label || styleValue;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  const remainingHooks = user?.hooksLimit === -1 ? "∞" : Math.max(0, (user?.hooksLimit || 2) - (user?.hooksUsed || 0));
  const canGenerate = user?.hooksLimit === -1 || (user?.hooksUsed || 0) < (user?.hooksLimit || 2);

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2" data-testid="dashboard-title">Dashboard</h1>
          <p className="text-muted-foreground" data-testid="dashboard-description">Generate viral hooks for your content</p>
          <div className="mt-4 inline-flex items-center px-3 py-1 bg-muted text-muted-foreground text-sm font-medium border border-border">
            <AlertCircle className="mr-2 h-4 w-4" />
            <span data-testid="plan-info">
              {user?.subscriptionTier === 'free' ? 'Free Plan' : 
               user?.subscriptionTier === 'basic' ? 'Basic Plan' : 'Pro Plan'} - {remainingHooks} hooks remaining
            </span>
          </div>
        </div>

        {/* Hook Generation Form */}
        <Card className="mb-8" data-testid="generation-form">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wand2 className="mr-2 h-5 w-5" />
              Create New Hooks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="topic">Topic or Niche</Label>
              <Input
                id="topic"
                placeholder="e.g., fitness motivation, cooking tips, productivity hacks"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="mt-2"
                data-testid="input-topic"
              />
            </div>
            
            <div>
              <Label htmlFor="hook-style">Hook Style</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="mt-2" data-testid="select-style">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HOOK_STYLES.map((hookStyle) => (
                    <SelectItem key={hookStyle.value} value={hookStyle.value}>
                      {hookStyle.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="platform">Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="mt-2" data-testid="select-platform">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((platformOption) => (
                    <SelectItem key={platformOption.value} value={platformOption.value}>
                      {platformOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleGenerateHooks}
              disabled={generateHooksMutation.isPending || !canGenerate}
              className="w-full"
              data-testid="button-generate"
            >
              {generateHooksMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Hooks
                </>
              )}
            </Button>
            
            {!canGenerate && (
              <p className="text-sm text-muted-foreground text-center" data-testid="limit-message">
                You've reached your monthly hook limit. <a href="/pricing" className="text-primary underline">Upgrade your plan</a> for more hooks.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Loading State */}
        {generateHooksMutation.isPending && (
          <Card className="mb-8" data-testid="loading-state">
            <CardContent className="py-8">
              <div className="flex items-center mb-4">
                <Loader2 className="animate-spin h-5 w-5 mr-3" />
                <span className="text-foreground">Generating your viral hooks...</span>
              </div>
              <div className="space-y-4">
                <div className="h-16 bg-muted animate-pulse"></div>
                <div className="h-16 bg-muted animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generated Hooks */}
        {generatedHooks.length > 0 && (
          <div className="space-y-4" data-testid="hooks-container">
            {generatedHooks.map((hook, index) => (
              <Card key={hook.id || index} className="fade-in">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {getStyleLabel(hook.style).toUpperCase()}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(hook.content)}
                      className="text-muted-foreground hover:text-primary"
                      data-testid={`button-copy-${index}`}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-lg text-foreground font-medium" data-testid={`hook-content-${index}`}>
                    {hook.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
