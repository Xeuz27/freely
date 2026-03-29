import { outerLeads } from "@/modules/crmBoard/components/crm-board";
import type { CalendarEvent } from "@/types/calendar-types";

export const getEventsFromLeads = (): CalendarEvent[] => {
  /*@ts-ignore*/
  return outerLeads
    .map((lead) => {
      if (lead !== undefined && lead.action !== undefined) {
        return {
          id: lead.id,
          title: lead.action?.title,
          date: new Date(lead.action?.date),
          startTime: lead.action?.startTime,
          endTime: lead.action?.endTime
        };
      }
    })
    .filter((event) => event !== undefined);
};
