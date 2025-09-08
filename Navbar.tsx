import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap } from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  const navLinks = isAuthenticated ? [
    { href: "/", label: "Home" },
    { href: "/pricing", label: "Pricing" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/profile", label: "Profile" },
    { href: "/settings", label: "Settings" },
  ] : [
    { href: "/", label: "Home" },
    { href: "/pricing", label: "Pricing" },
  ];

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Zap className="text-2xl text-primary mr-2" data-testid="logo-icon" />
              <span className="text-xl font-bold text-primary" data-testid="logo-text">Cloutline</span>
            </Link>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className={`px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                  isActive(link.href) 
                    ? "text-foreground" 
                    : "text-muted-foreground hover:text-primary"
                }`} data-testid={`nav-link-${link.label.toLowerCase()}`}>
                  {link.label}
                </span>
              </Link>
            ))}
            
            {!isLoading && (
              isAuthenticated ? (
                <Button 
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/logout', { method: 'POST' });
                      if (response.ok) {
                        window.location.href = '/';
                      }
                    } catch (error) {
                      console.error('Logout failed:', error);
                    }
                  }}
                  variant="outline"
                  data-testid="button-logout"
                >
                  Logout
                </Button>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button 
                    asChild
                    variant="outline"
                    data-testid="button-login"
                  >
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button 
                    asChild
                    data-testid="button-signup"
                  >
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              )
            )}
          </div>
          
          <div className="sm:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-muted-foreground hover:text-primary"
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="text-xl" /> : <Menu className="text-xl" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t border-border bg-background" data-testid="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span 
                  className={`block px-3 py-2 text-base font-medium cursor-pointer ${
                    isActive(link.href) 
                      ? "text-foreground" 
                      : "text-muted-foreground hover:text-primary"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            
            {!isLoading && (
              <div className="mt-2 space-y-2">
                {isAuthenticated ? (
                  <Button 
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/logout', { method: 'POST' });
                        if (response.ok) {
                          window.location.href = '/';
                        }
                      } catch (error) {
                        console.error('Logout failed:', error);
                      }
                    }}
                    variant="outline" 
                    className="w-full"
                    data-testid="mobile-button-logout"
                  >
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button 
                      asChild 
                      variant="outline"
                      className="w-full"
                      data-testid="mobile-button-login"
                    >
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button 
                      asChild 
                      className="w-full"
                      data-testid="mobile-button-signup"
                    >
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
