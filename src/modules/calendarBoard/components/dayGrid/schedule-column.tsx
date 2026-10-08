import { Badge } from "@/components/ui/badge";
import { dayTimeSlots } from "@/data/dayTimeSlots";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import useCalendarContext from "../../hooks/useCalendarContext";
import { handleAddEvent } from "../../utils/handlers";
import { isToday } from "../../utils/isToday";
import { DayEventCard } from "./day-event-card";
import { useSidebar } from "@/components/ui/sidebar";

const ScheduleColumn = () => {
  const {
    getEventsForDate,
    currentDate,
    selectedTime,
    setEditingEvent,
    setSelectedDate,
    setSelectedTime,
    setDialogOpen
  } = useCalendarContext();
  const dayEvents = getEventsForDate(currentDate);
  const {open} = useSidebar();

  return (
    <div className=" sm:max-lg:max-w-2/4 flex flex-col min-w-0 flex-1">
      <div className="flex max-md:flex-col items-center justify-between py-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          {isToday(currentDate) ? "Today's Schedule" : "Schedule"}
        </h3>
        <Badge variant="outline" className="text-xs border-0">
          {dayEvents.length} events
        </Badge>
      </div>
      <div className={`
      ${open ? '' : ''}
      flex-1 min-w-0 overflow-y-auto pb-8 transition-[width] duration-200 ease-linear overflow-x-hidden pr-2 gap-2 flex flex-col relative
      `}>
        {dayTimeSlots
          .filter((_, index) => index % 2 === 0)
          .map((time) => {
            const slotEvents = dayEvents.filter(
              (event) =>
                event.startTime === time ||
                event.startTime === dayTimeSlots[dayTimeSlots.indexOf(time) + 1]
            );

            return (
              <div key={time} className="flex gap-2 group/slot">
                <div className="w-16 max-[769px]:w-8 py-3 text-xs text-muted-foreground text-left shrink-0">
                  {time}
                </div>
                <div
                  className={cn(
                    "flex-1 min-h-15 sm:max-[769px]:max-w-60 border-t border-border/50 relative cursor-pointer rounded transition-colors",
                    slotEvents.length > 0 ? "" : "hover:bg-secondary/20"
                  )}
                  onClick={() => {
                    handleAddEvent(
                      currentDate,
                      selectedTime,
                      setEditingEvent,
                      setSelectedDate,
                      setSelectedTime,
                      setDialogOpen
                    );
                    setSelectedTime(time);
                  }}
                >
                  {slotEvents.length === 0 && (
                    <button
                      className="absolute right-2 top-2 opacity-0 group-hover/slot:opacity-100 p-1 hover:bg-secondary rounded transition-opacity"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleAddEvent(
                          currentDate,
                          selectedTime,
                          setEditingEvent,
                          setSelectedDate,
                          setSelectedTime,
                          setDialogOpen
                        );
                        setSelectedTime(time);
                      }}
                    >
                      <Plus className="size-3.5 text-muted-foreground" />
                    </button>
                  )}
                  <div className="flex flex-col gap-6 px-2">
                    {slotEvents.map((event) => (
                      <DayEventCard key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export { ScheduleColumn };