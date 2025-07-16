import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SearchBox } from "./SearchBox";
import { UserAvatar } from "./UserAvatar";

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar = ({ onToggleSidebar }: NavbarProps) => {
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-[#f6f8fc] flex items-center px-2 gap-2">
      <div className="flex items-center gap-1">
        <button
          onClick={onToggleSidebar}
          className="p-3 hover:bg-[#e8eaed] rounded-full transition-colors"
          aria-label="Main menu"
        >
          <Menu size={20} className="text-[#5f6368]" />
        </button>
        
        <button
          onClick={() => navigate('/inbox')}
          className="flex items-center cursor-pointer gap-2 px-2"
          aria-label="Gmail"
        >
          <img src="/assets/logo.png" alt="Gmail" className="h-10" />
        </button>
      </div>
      
      <SearchBox />
      
      <UserAvatar />
    </header>
  );
};