import { Search, SlidersHorizontal } from "lucide-react";

export const SearchBox = () => {
  return (
    <div className="flex-1 max-w-[720px] mx-auto">
      <div className="flex items-center bg-[#eaf1fb] rounded-lg h-12 px-2 gap-2 focus-within:bg-white focus-within:shadow-[0_1px_3px_0_rgba(60,64,67,0.3)] transition-all">
        <button className="p-2 hover:bg-[#e8eaed] rounded-full transition-colors">
          <Search size={20} className="text-[#5f6368]" />
        </button>
        
        <input
          type="text"
          placeholder="Search mail"
          className="flex-1 bg-transparent outline-none text-[#202124] placeholder-[#5f6368]"
        />
        
        <button className="p-2 hover:bg-[#e8eaed] rounded-full transition-colors">
          <SlidersHorizontal size={20} className="text-[#5f6368]" />
        </button>
      </div>
    </div>
  );
};