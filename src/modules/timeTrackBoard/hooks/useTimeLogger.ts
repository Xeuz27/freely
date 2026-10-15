import usePersist from "src/modules/core/hooks/usePersist";
import { useStore } from "@nanostores/react";
import { setState, state } from "src/store/timeTrack";
import type { TimeEntry } from "src/types/timetrack-types";
import { useEffect, useState } from "react";
import { isSameDay } from "src/modules/calendarBoard/utils/eventQueries";
import useTimeTracker from "./useTimetracker";

const useTimeLogger = (currentDate: Date) => {
  const [todayEntries, setTodayEntries] = useState<TimeEntry[]>([]);
  const $Store = useStore(state);
  const { entries } = $Store;

  usePersist("entries", entries, (persistedEntries: TimeEntry[]) => {
    setState({
      entries: persistedEntries.map((entry) => ({
        ...entry,
        createdAt: new Date(entry.createdAt),
        date: new Date(entry.date),
      })),
    });
  });

  useEffect(() => {
    let a = getEntriesForDate(currentDate);
    //no se muestran en dayview
    setTodayEntries(a);
  }, [entries, currentDate]);

  const getEntriesForDate = (date: Date) =>
    entries.filter((entry) => isSameDay(entry.date, date));

  return {
    todayEntries,
    getEntriesForDate,
  };
};
export default useTimeLogger;
