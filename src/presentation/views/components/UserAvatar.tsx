import { Grid3X3, HelpCircle } from "lucide-react";

export const UserAvatar = () => {
  return (
    <div className="flex items-center gap-1">
      <button className="p-2 hover:bg-[#e8eaed] rounded-full transition-colors">
        <HelpCircle size={24} className="text-[#5f6368]" />
      </button>
      
      <button className="p-2 hover:bg-[#e8eaed] rounded-full transition-colors">
        <Grid3X3 size={24} className="text-[#5f6368]" />
      </button>
      
      <button className="ml-2 pt-1 w-8 h-8 rounded-full bg-[#1a73e8] flex items-center justify-center text-white text-sm font-medium hover:ring-4 hover:ring-[#1a73e8]/20 transition-all">
        U
      </button>
    </div>
  );
};