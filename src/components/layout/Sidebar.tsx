
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

type SidebarItem = {
  title: string;
  href: string;
  icon: string;
  adminOnly?: boolean;
};

const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: '📊',
  },
  {
    title: 'My Videos',
    href: '/videos',
    icon: '🎬',
  },
  {
    title: 'Upload',
    href: '/upload',
    icon: '⬆️',
  },
  {
    title: 'Users',
    href: '/users',
    icon: '👥',
    adminOnly: true,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: '⚙️',
  },
];

export function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  
  // Filter items based on user role
  const filteredItems = sidebarItems.filter(
    item => !item.adminOnly || (item.adminOnly && user?.role === 'admin')
  );

  return (
    <div className="w-64 h-full bg-sidebar border-r border-border flex flex-col">
      <div className="p-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl">🎥</span>
          <h1 className="font-bold text-xl text-sidebar-foreground">Video Vault</h1>
        </Link>
      </div>
      
      <div className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.href;
            
            return (
              <Link 
                key={item.href} 
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center space-x-3">
          {user?.avatarUrl && (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.name}
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
