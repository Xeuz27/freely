import { AllEventsColumn } from "./all-events-column";
import { ScheduleColumn } from "./schedule-column";

const DayGrid = () => {
  return (
    <div className="h-full flex-1 flex gap-4 max-md:gap-2">
      <ScheduleColumn />
      <AllEventsColumn />
    </div>
  );
};

export { DayGrid };
