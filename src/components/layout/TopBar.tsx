
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Sidebar } from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

export function TopBar() {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-background">
      <div className="flex items-center">
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <Sidebar />
            </SheetContent>
          </Sheet>
        )}
        <div className="flex items-center lg:hidden">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🎥</span>
            <h1 className="font-bold text-xl">Video Vault</h1>
          </Link>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={logout}>
          Log out
        </Button>
        
        {user?.avatarUrl && (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-8 h-8 rounded-full border border-border"
          />
        )}
      </div>
    </header>
  );
}
