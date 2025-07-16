import { NavLink } from "react-router-dom";
import {
  Inbox,
  Star,
  Clock,
  Send,
  FileText,
  Mail,
  AlertTriangle,
  Trash2,
  Edit,
  type LucideIcon,
} from "lucide-react";
import type { ThreadGrouping } from "../../../domain/models/email.model";
import { useSidebarViewModel } from "../../viewmodels/sidebar.viewmodel";

interface SidebarProps {
  isCollapsed: boolean;
}

const groupings: { label: string; path: ThreadGrouping; Icon: LucideIcon }[] = [
  { label: "Inbox", path: "inbox", Icon: Inbox },
  { label: "Starred", path: "starred", Icon: Star },
  { label: "Snoozed", path: "snoozed", Icon: Clock },
  { label: "Sent", path: "sent", Icon: Send },
  { label: "Drafts", path: "drafts", Icon: FileText },
  { label: "All Mail", path: "all", Icon: Mail },
  { label: "Spam", path: "spam", Icon: AlertTriangle },
  { label: "Trash", path: "trash", Icon: Trash2 },
];

export const Sidebar = ({ isCollapsed }: SidebarProps) => {
  const { groupingCounts } = useSidebarViewModel();
  return (
    <nav className={`${isCollapsed ? 'w-[72px]' : 'w-[256px]'} bg-white pt-4 transition-all duration-200`}>
      <div className="px-3 mb-2">
        <button className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'} bg-[#c2e7ff] hover:shadow-md rounded-2xl ${isCollapsed ? 'p-3' : 'px-6 py-3.5'} transition-all w-full`}>
          <Edit size={20} className="text-[#001d35]" />
          {!isCollapsed && <span className="text-sm font-medium text-[#001d35]">Compose</span>}
        </button>
      </div>

      <ul>
        {groupings.map(({ label, path, Icon }) => (
          <li key={path}>
            <NavLink
              to={`/${path}`}
              className={({ isActive }) =>
                `flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} ${isCollapsed ? 'px-3 py-2' : 'pl-6 pr-4 py-2'} text-sm transition-colors ${
                  isActive
                    ? "bg-[#d3e3fd] text-[#001d35] font-medium"
                    : "text-[#202124] hover:bg-[#f1f3f4]"
                } ${isCollapsed ? 'mx-2 rounded-full' : 'mr-3 rounded-r-full'} my-0.5`
              }
              title={isCollapsed ? label : undefined}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={20}
                    className={isActive ? "text-[#001d35]" : "text-[#5f6368]"}
                  />
                  {!isCollapsed && (
                    <span className={`flex-1 ${isActive ? 'font-bold' : ''}`}>{label}</span>
                  )}
                  {!isCollapsed && groupingCounts[path] > 0 && (
                    <span className={`text-xs ${isActive ? 'font-bold text-[#001d35]' : 'text-[#5f6368]'}`}>
                      {groupingCounts[path]}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};