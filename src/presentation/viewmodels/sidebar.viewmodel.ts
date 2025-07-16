import { useEffect, useState, useCallback } from "react";
import type { ThreadGrouping } from "../../domain/models/email.model";
import { useEmailStore } from "../../domain/store/email.store";

const groupings: ThreadGrouping[] = [
  "inbox",
  "starred", 
  "snoozed",
  "sent",
  "drafts",
  "all",
  "spam",
  "trash"
];

export const useSidebarViewModel = () => {
  const [groupingCounts, setGroupingCounts] = useState<Record<ThreadGrouping, number>>({} as Record<ThreadGrouping, number>);
  const { emailUseCase, threads } = useEmailStore();

  const updateCounts = useCallback(() => {
    const counts: Record<ThreadGrouping, number> = {} as Record<ThreadGrouping, number>;
    groupings.forEach((grouping) => {
      const threadsForGrouping = emailUseCase.getThreadsByGrouping(grouping);
      counts[grouping] = threadsForGrouping.length;
    });
    setGroupingCounts(counts);
  }, [emailUseCase]);

  useEffect(() => {
    updateCounts();
  }, [threads, updateCounts]);

  return {
    groupingCounts
  };
};