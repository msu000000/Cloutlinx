import { Button } from "@/components/ui/button";
import { Check, Shield, RotateCcw, Headphones } from "lucide-react";

export default function Pricing() {
  const handleBasicPlan = () => {
    // TODO: Implement Stripe checkout for Basic plan
    console.log("Basic plan selected");
  };

  const handleProPlan = () => {
    // TODO: Implement Stripe checkout for Pro plan
    console.log("Pro plan selected");
  };

  return (
    <div className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6" data-testid="pricing-title">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="pricing-description">
            Choose the plan that fits your content creation needs. Upgrade or downgrade at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Basic Plan */}
          <div className="bg-card border-2 border-border p-8 relative" data-testid="plan-basic">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">Basic</h3>
              <div className="flex items-center justify-center mb-4">
                <span className="text-4xl font-bold text-foreground">$5</span>
                <span className="text-muted-foreground ml-2">/month</span>
              </div>
              <p className="text-muted-foreground">Perfect for individual creators</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-foreground">
                <Check className="text-primary mr-3 h-5 w-5" />
                10 hooks per generation
              </li>
              <li className="flex items-center text-foreground">
                <Check className="text-primary mr-3 h-5 w-5" />
                All 5 hook styles
              </li>
              <li className="flex items-center text-foreground">
                <Check className="text-primary mr-3 h-5 w-5" />
                One-click copy functionality
              </li>
              <li className="flex items-center text-foreground">
                <Check className="text-primary mr-3 h-5 w-5" />
                Priority support
              </li>
            </ul>
            
            <Button 
              onClick={handleBasicPlan}
              variant="outline" 
              className="w-full"
              data-testid="button-choose-basic"
            >
              Choose Basic
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="bg-card border-2 border-primary p-8 relative" data-testid="plan-pro">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary text-primary-foreground px-4 py-1 text-sm font-semibold">
                MOST POPULAR
              </span>
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">Pro</h3>
              <div className="flex items-center justify-center mb-4">
                <span className="text-4xl font-bold text-foreground">$10</span>
                <span className="text-muted-foreground ml-2">/month</span>
              </div>
              <p className="text-muted-foreground">For serious content creators</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-foreground">
                <Check className="text-primary mr-3 h-5 w-5" />
                <span className="font-semibold">Unlimited</span> hooks per generation
              </li>
              <li className="flex items-center text-foreground">
                <Check className="text-primary mr-3 h-5 w-5" />
                All 5 hook styles
              </li>
              <li className="flex items-center text-foreground">
                <Check className="text-primary mr-3 h-5 w-5" />
                One-click copy functionality
              </li>
              <li className="flex items-center text-foreground">
                <Check className="text-primary mr-3 h-5 w-5" />
                Priority support
              </li>
              <li className="flex items-center text-foreground">
                <Check className="text-primary mr-3 h-5 w-5" />
                Advanced customization
              </li>
            </ul>
            
            <Button 
              onClick={handleProPlan}
              className="w-full"
              data-testid="button-choose-pro"
            >
              Choose Pro
            </Button>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4" data-testid="guarantee-text">
            All plans include a 7-day money-back guarantee
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center" data-testid="feature-secure">
              <Shield className="mr-2 h-4 w-4" />
              Secure payments
            </div>
            <div className="flex items-center" data-testid="feature-cancel">
              <RotateCcw className="mr-2 h-4 w-4" />
              Cancel anytime
            </div>
            <div className="flex items-center" data-testid="feature-support">
              <Headphones className="mr-2 h-4 w-4" />
              24/7 support
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
