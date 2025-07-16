import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-[#f6f8fc]">
      <Navbar onToggleSidebar={() => setIsCollapsed(!isCollapsed)} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isCollapsed={isCollapsed} />
        
        <main className="flex-1 overflow-hidden bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
