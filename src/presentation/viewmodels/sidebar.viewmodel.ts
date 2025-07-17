import { useEffect, useState, useCallback } from "react";
import type { ThreadGrouping } from "../../domain/models/email.model";
import { useEmailViewModel } from "./email.viewmodel";
import { emailUseCase } from "../../domain/usecases/email.usecase";

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
  const { threads } = useEmailViewModel();

  const updateCounts = useCallback(() => {
    const counts: Record<ThreadGrouping, number> = {} as Record<ThreadGrouping, number>;
    groupings.forEach((grouping) => {
      const threadsForGrouping = emailUseCase.getThreadsByGrouping(grouping);
      counts[grouping] = threadsForGrouping.length;
    });
    setGroupingCounts(counts);
  }, []);

  useEffect(() => {
    updateCounts();
  }, [threads, updateCounts]);

  return {
    groupingCounts
  };
};