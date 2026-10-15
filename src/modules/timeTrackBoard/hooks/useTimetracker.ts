import { useState, useMemo, useEffect } from "react";
import { sampleKanbanCards } from "src/data/sampleKanbanCards";
import { type TimeEntry, calculateDuration } from "src/types/timetrack-types";
import { sampleProjects } from "../components/timetrack-board";
import { initialEntries } from "@/types/timetrack-types";
import { useStore } from "@nanostores/react";
import { entriesHandler, getState, setState, state } from "src/store/timeTrack";
import usePersist from "src/modules/core/hooks/usePersist";
import { format } from "node_modules/@formkit/tempo/dist";
import useTimeLogger from "./useTimeLogger";
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

const setEntries = (entries: TimeEntry[]) => {
  setState({ entries: entries });
};
const useTimeTracker = () => {
  const $state = useStore(state);
  const { entries } = $state;

  // const [entries, setEntries] = useState<TimeEntry[]>(initialEntries)
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<TimeEntry | null>(null);
  const [initialStartTime, setInitialStartTime] = useState<string | undefined>();
  const [initialEndTime, setInitialEndTime] = useState<string | undefined>();
  const [viewMode, setViewMode] = useState<"day" | "week">("day");
  const { todayEntries, getEntriesForDate } = useTimeLogger(currentDate);

  const projects = sampleProjects;
  const kanbanCards = sampleKanbanCards;

  const isSameDay = (a: Date, b: Date) =>
    //prettier-ignore
    a.getFullYear() === b.getFullYear() &&
	a.getMonth() === b.getMonth() &&
	a.getDate() === b.getDate();

  const isToday = (date: Date) => isSameDay(date, new Date());

  const getWeekDates = useMemo(() => {
    const dates: Date[] = [];
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, [currentDate]);

  const todayTotalMinutes = todayEntries.reduce(
    (acc, e) => acc + calculateDuration(e.startTime, e.endTime),
    0,
  );

  const weekTotalMinutes = useMemo(() => {
    return getWeekDates.reduce((acc, date) => {
      const dayEntries = getEntriesForDate(date);
      return (
        acc +
        dayEntries.reduce((dayAcc, e) => {
          return dayAcc + calculateDuration(e.startTime, e.endTime);
        }, 0)
      );
    }, 0);
  }, [getWeekDates, entries]);

  const handleAddEntry = (startTime?: string, endTime?: string) => {
    setEditEntry(null);
    setInitialStartTime(startTime);
    setInitialEndTime(endTime);
    setDialogOpen(true);
  };

  const handleEditEntry = (entry: TimeEntry) => {
    setEditEntry(entry);
    setInitialStartTime(undefined);
    setInitialEndTime(undefined);
    setDialogOpen(true);
  };

  const handleDeleteEntry = (id: string) => {
    // setEntries((prev) => prev.filter((e) => e.id !== id))
    const { entries } = getState();
    const entry = entries.filter((e) => e.id === id).slice(0, 1);
    console.log(entry);
    // entriesHandler(entry,true)
  };

  const handleSaveEntry = (
    entryData: Omit<TimeEntry, "id" | "createdAt"> & { id?: string },
  ) => {
    if (entryData.id) {
      // setEntries((prev) => prev.map((e) => (e.id === entryData.id ? { ...entryData, id: e.id, createdAt: e.createdAt } : e)))
    } else {
      const newEntry: TimeEntry = {
        ...entryData,
        id: `entry-${Date.now()}`,
        createdAt: new Date(),
      };
      entriesHandler(newEntry);
    }
  };

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    } else {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatDateHeader = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatShortDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
    });
  };

  const getProjectById = (id?: string) => projects.find((p) => p.id === id);
  const getKanbanCardById = (id?: string) =>
    kanbanCards.find((c) => c.id === id);

  return {
    entries,
    setEntries,
    currentDate,
    setCurrentDate,
    dialogOpen,
    setDialogOpen,
    editEntry,
    setEditEntry,
    initialStartTime,
    setInitialStartTime,
    initialEndTime,
    setInitialEndTime,
    viewMode,
    setViewMode,
    projects,
    kanbanCards,
    isSameDay,
    isToday,
    getWeekDates,
    todayEntries,
    todayTotalMinutes,
    weekTotalMinutes,
    handleAddEntry,
    handleEditEntry,
    handleDeleteEntry,
    handleSaveEntry,
    navigateDate,
    goToToday,
    formatDateHeader,
    formatShortDate,
    getProjectById,
    getKanbanCardById,
  };
};
export default useTimeTracker;
