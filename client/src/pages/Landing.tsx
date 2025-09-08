import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Target, TrendingUp } from "lucide-react";

export default function Landing() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight tracking-tight" data-testid="hero-title">
              Generate Viral Hooks
              <span className="block text-primary">with AI</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="hero-description">
              Create compelling TikTok and Instagram Reels hooks that capture attention and drive engagement. 
              Our AI understands what makes content go viral.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="w-full sm:w-auto" data-testid="button-try-free">
                <Link href="/signup">
                  Try Free (2 hooks)
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto" data-testid="button-view-pricing">
                <Link href="/pricing">
                  View Pricing
                </Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground" data-testid="hero-subtitle">
              No credit card required • Get started in seconds
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground" data-testid="features-title">
              Why Choose Cloutline?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground" data-testid="features-description">
              Everything you need to create viral content
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-card border border-border" data-testid="feature-fast">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="text-2xl text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Lightning Fast</h3>
              <p className="text-muted-foreground">Generate multiple viral hooks in seconds with our AI-powered system.</p>
            </div>
            <div className="text-center p-8 bg-card border border-border" data-testid="feature-targeted">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="text-2xl text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Targeted Styles</h3>
              <p className="text-muted-foreground">Choose from 5 proven hook styles that drive engagement and views.</p>
            </div>
            <div className="text-center p-8 bg-card border border-border" data-testid="feature-results">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="text-2xl text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Proven Results</h3>
              <p className="text-muted-foreground">Our hooks are optimized for maximum engagement and viral potential.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-background">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6" data-testid="cta-title">
            Ready to Go Viral?
          </h2>
          <p className="text-lg text-muted-foreground mb-8" data-testid="cta-description">
            Join thousands of creators who trust Cloutline for their viral content needs.
          </p>
          <Button asChild size="lg" data-testid="button-start-creating">
            <Link href="/signup">
              Start Creating Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
