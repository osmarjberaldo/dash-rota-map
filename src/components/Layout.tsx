
import React, { ReactNode } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-semibold tracking-tight">Sea Route Dashboard</h1>
            <span className="px-2 py-0.5 bg-sea-light text-sea-dark text-xs font-medium rounded-full">
              Beta
            </span>
          </div>
          <nav className="flex items-center space-x-6">
            <a href="#" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Dashboard
            </a>
            <a href="#" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Routes
            </a>
            <a href="#" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Vessels
            </a>
            <a href="#" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Analytics
            </a>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 w-full">
        {children}
      </main>
      
      <footer className="border-t py-4 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Sea Route Dashboard © {new Date().getFullYear()}
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      <Toaster />
      <Sonner />
    </div>
  );
};

export default Layout;
