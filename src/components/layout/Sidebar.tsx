import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Shirt,
  CalendarDays,
  Dumbbell,
} from 'lucide-react'; // Added Dumbbell icon

interface SidebarProps {
  isCollapsed?: boolean;
}

const navItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Teams',
    href: '/teams',
    icon: Users,
  },
  {
    name: 'Players',
    href: '/players',
    icon: Shirt,
  },
  {
    name: 'Schedule',
    href: '/schedule',
    icon: CalendarDays,
  },
  {
    name: 'Training', // New navigation item
    href: '/training',
    icon: Dumbbell, // New icon
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false }) => {
  const location = useLocation();

  return (
    <nav
      className={cn(
        'flex flex-col gap-2 p-4',
        isCollapsed ? 'items-center' : ''
      )}
    >
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
            location.pathname === item.href && 'bg-muted text-primary',
            isCollapsed ? 'justify-center' : ''
          )}
        >
          <item.icon className="h-5 w-5" />
          {!isCollapsed && item.name}
        </Link>
      ))}
    </nav>
  );
};

export default Sidebar;
