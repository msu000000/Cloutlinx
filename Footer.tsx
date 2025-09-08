import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background py-8" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Zap className="text-xl text-primary mr-2" data-testid="footer-logo-icon" />
            <span className="text-lg font-bold text-primary" data-testid="footer-logo-text">Cloutline</span>
          </div>
          <p className="text-muted-foreground" data-testid="footer-copyright">
            © 2025 Cloutline. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
