import { cn } from "@/lib/utils";
import {
  eventTypeConfig,
  type CalendarEvent,
  type EventType
} from "@/types/calendar-types";
import {
  AlertCircle,
  Bell,
  CheckSquare,
  Clock,
  Phone,
  Users
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import useCalendarContext from "../../hooks/useCalendarContext";
import { handleEditEvent } from "../../utils/handlers";

const eventIcons: Record<EventType, LucideIcon> = {
  meeting: Users,
  call: Phone,
  task: CheckSquare,
  reminder: Bell,
  deadline: AlertCircle
};

type DayEventCardProps = {
  event: CalendarEvent;
  onClick?: () => void;
  showActions?: boolean;
  className?: string;
};

const DayEventCard = ({
  event,
  className
}: DayEventCardProps) => {
  const { setEditingEvent, setSelectedDate, setSelectedTime, setDialogOpen } =
    useCalendarContext();
  const EventIcon = eventIcons[event.type];
  const content = (
    <>
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10">
        <EventIcon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="sm:max-[1025px]:group-has-data-[state=expanded]/sidebar-wrapper:max-w-24 whitespace-break-spaces truncate wrap-break-word font-semibold line-clamp-3">{event.title}
        </p>
        {event.startTime && (
          <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs opacity-80">  
            <Clock className="size-3 shrink-0" />
            <span className="flex flex-row gap-1">
              {event.startTime} 
              {event.endTime && <span className="xs:max-md:block hidden px-1">{`-`}</span>}
              {event.endTime && ` ${event.endTime}`}
            </span>
          </div>
        )}
        {event.description && (
          <p className="mt-1 line-clamp-3 wrap-break-word text-xs opacity-70">
            {event.description}
          </p>
        )}
      </div>
    </>
  );

  return (
    <div
      className={cn(
        "group flex min-w-0 items-center gap-2 rounded-lg border p-2 text-sm",
        eventTypeConfig[event.type].color,
        className
      )}
      onClick={(e) => {
        e.stopPropagation()
        handleEditEvent(
                  event,
                  setEditingEvent,
                  setSelectedDate,
                  setSelectedTime,
                  setDialogOpen
                )
      }
    }
    >
      <div className="flex min-w-0 flex-1 pointer-events-none items-center gap-2">{content}</div>
    </div>
  );
};

export { DayEventCard };
