import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
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
  Edit2,
  MoreHorizontal,
  MoreVertical,
  Phone,
  Trash2,
  Users
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import useCalendarContext from "../../hooks/useCalendarContext";
import { handleDeleteEvent, handleEditEvent } from "../../utils/handlers";

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
  onClick,
  showActions = onClick === undefined,
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
        <p className="truncate wrap-break-word font-semibold">{event.title}</p>
        {event.startTime && (
          <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs opacity-80">
            <Clock className="size-3 shrink-0" />
            <span className="truncate">
              {event.startTime}
              {event.endTime && ` - ${event.endTime}`}
            </span>
          </div>
        )}
        {event.description && (
          <p className="mt-1 line-clamp-2 wrap-break-word text-xs opacity-70">
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
    >
      {onClick ? (
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
          onClick={onClick}
        >
          {content}
        </button>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-2">{content}</div>
      )}
      {showActions && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Event actions"
              className="shrink-0 rounded p-1 hover:bg-white/10"
              onClick={(clickEvent) => clickEvent.stopPropagation()}
            >
              {/* wrapear el contenido o romper las palabras de las cartas en today schedule cuando la barra de movil esta abierta en 768px
              solucion cambiar las clases sgun open de use sidebar y cambiar el max-md a max-[769px] en la columna de schedule?°
              */}
              <MoreHorizontal className="hidden size-4 md:block" />
              <MoreVertical className="size-5 md:hidden" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                handleEditEvent(
                  event,
                  setEditingEvent,
                  setSelectedDate,
                  setSelectedTime,
                  setDialogOpen
                )
              }
            >
            <Edit2 className="size-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeleteEvent(event)}
              className="text-red-400"
            >
            <Trash2 className="size-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export { DayEventCard };
