import { useState } from 'react';
import type { ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
}

export const Tooltip = ({ content, children }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-[#323232] text-white text-xs rounded shadow-lg whitespace-nowrap z-50">
          {content}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-[#323232]"></div>
        </div>
      )}
    </div>
  );
};