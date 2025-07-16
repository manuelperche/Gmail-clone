export const ThreadListSkeleton = () => {
  return (
    <div className="bg-white">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex items-center px-6 py-3 border-b border-[#e8eaed] animate-pulse">
          {/* Checkbox skeleton */}
          <div className="w-4 h-4 bg-gray-200 rounded-sm mr-4"></div>
          
          {/* Star skeleton */}
          <div className="w-5 h-5 bg-gray-200 rounded mr-3"></div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              {/* Sender name skeleton */}
              <div className="h-4 bg-gray-200 rounded w-32 mr-4"></div>
              
              {/* Subject skeleton */}
              <div className="h-4 bg-gray-200 rounded flex-1 mr-4"></div>
              
              {/* Date skeleton */}
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
            
            {/* Snippet skeleton */}
            <div className="h-3 bg-gray-100 rounded w-3/4 mt-2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};