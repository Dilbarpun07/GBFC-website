import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-background">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <Link to="/" className="text-xl font-bold text-primary">
          SportEasy
        </Link>
      </div>
      {/* Future: Add user profile, notifications, etc. */}
      <div>
        {/* <Button variant="ghost">Sign Out</Button> */}
      </div>
    </header>
  );
};

export default Header;