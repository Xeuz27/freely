import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { eventTypeConfig, type EventType } from "@/types/calendar-types";
import { CalendarDays, Plus } from "lucide-react";
import useCalendarContext from "../../hooks/useCalendarContext";
import { handleAddEvent, handleEditEvent } from "../../utils/handlers";
import { sortEventsByStartTime } from "../../utils/eventQueries";
import { eventTypeIcons } from "../calendar-board";
import { DayEventCard } from "./day-event-card";

const AllEventsColumn = () => {
  const {
    getEventsForDate,
    currentDate,
    selectedTime,
    setEditingEvent,
    setSelectedDate,
    setSelectedTime,
    setDialogOpen
  } = useCalendarContext();
  const dayEvents = sortEventsByStartTime(getEventsForDate(currentDate));
  const eventsByType = (Object.keys(eventTypeConfig) as EventType[])
    .map((type) => ({
      type,
      count: dayEvents.filter((event) => event.type === type).length
    }))
    .filter(({ count }) => count > 0);
  return (
    <div className="flex flex-col flex-1 max-sm:hidden border-l border-border pl-4 pr-0 relative">
      <div className="py-4">
        <h3 className="text-sm font-medium text-muted-foreground">All Events</h3>
      </div>
      <div className="flex-1 pr-2 overflow-y-auto">
        {dayEvents.length === 0 ? (
          <div className="text-center py-8">
            <div className="flex items-center justify-center size-12 rounded-full bg-secondary/50 mx-auto mb-3">
              <CalendarDays className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No events scheduled</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() =>
                handleAddEvent(
                  currentDate,
                  selectedTime,
                  setEditingEvent,
                  setSelectedDate,
                  setSelectedTime,
                  setDialogOpen
                )
              }
            >
              <Plus className="size-3.5 mr-1" />
              Add Event
            </Button>
          </div>
        ) : (
          dayEvents.map((event) => (
            <DayEventCard
              key={event.id}
              event={event}
              className="mb-2"
              onClick={() =>
                handleEditEvent(
                  event,
                  setEditingEvent,
                  setSelectedDate,
                  setSelectedTime,
                  setDialogOpen
                )
              }
              showActions={false}
            />
          ))
        )}

        {dayEvents.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <h4 className="text-xs font-medium text-muted-foreground mb-3">
              By Type
            </h4>
            <div className="flex flex-col flex-wrap gap-2">
              {eventsByType.map(({ type, count }) => {
                const Icon = eventTypeIcons[type];
                return (
                     <div
                    key={type}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-md text-xs",
                      eventTypeConfig[type].color
                    )}
                  >
                    {Icon && <Icon className="size-4 lg:size-5" />}
                    <span className="capitalize w-fit">{type}</span>
                    <span className="ml-auto font-medium">{count}</span>
                  </div>
                ) }
              )
              }
              </div>
            </div> 
            )
        }
      </div>
    </div>
  );
};

export { AllEventsColumn };