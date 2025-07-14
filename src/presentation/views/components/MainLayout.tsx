import { Outlet, NavLink } from "react-router-dom";
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
import type { ThreadGrouping } from "../../../data/models/email.model";

export const MainLayout = () => {
  const groupings: { label: string; path: ThreadGrouping; Icon: LucideIcon }[] =
    [
      { label: "Inbox", path: "inbox", Icon: Inbox },
      { label: "Starred", path: "starred", Icon: Star },
      { label: "Snoozed", path: "snoozed", Icon: Clock },
      { label: "Sent", path: "sent", Icon: Send },
      { label: "Drafts", path: "drafts", Icon: FileText },
      { label: "All Mail", path: "all", Icon: Mail },
      { label: "Spam", path: "spam", Icon: AlertTriangle },
      { label: "Trash", path: "trash", Icon: Trash2 },
    ];

  return (
    <div className="flex h-screen bg-[#f6f8fc]">
      <nav className="w-[256px] bg-[#eaf1fb] pt-2">
        <div className="px-3 mb-4">
          <button className="flex items-center gap-4 bg-[#c2e7ff] hover:shadow-md rounded-2xl px-5 py-3 transition-shadow">
            <Edit size={20} className="text-[#001d35]" />
            <span className="text-sm font-medium text-[#001d35]">Compose</span>
          </button>
        </div>

        <ul>
          {groupings.map(({ label, path, Icon }) => (
            <li key={path}>
              <NavLink
                to={`/${path}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-7 py-1 text-sm transition-colors relative ${
                    isActive
                      ? "bg-[#fce8e6] text-[#d93025] font-medium"
                      : "text-[#202124] hover:bg-[#e8eaed]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#d93025] rounded-r" />
                    )}
                    <Icon
                      size={20}
                      className={isActive ? "text-[#d93025]" : "text-[#5f6368]"}
                    />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <main className="flex-1 overflow-hidden bg-white rounded-tl-2xl">
        <Outlet />
      </main>
    </div>
  );
};
