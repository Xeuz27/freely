import type { CalendarEvent } from "@/types/calendar-types";

export const sampleEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Call with Sarah Chen",
    description: "Discuss enterprise plan details",
    date: new Date(),
    startTime: "10:00",
    endTime: "11:00",
    type: "call",
    leadId: "1",
    leadName: "Sarah Chen",
    leadStatus: "qualified",
    createdAt: new Date()
  },
  {
    id: "2",
    title: "Team sync",
    description: "Weekly team meeting",
    date: new Date(),
    startTime: "14:00",
    endTime: "15:00",
    type: "meeting",
    createdAt: new Date()
  },
  {
    id: "3",
    title: "Proposal deadline",
    description: "Send proposal to GlobalTech",
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    type: "deadline",
    leadId: "4",
    leadName: "David Kim",
    leadStatus: "negotiation",
    createdAt: new Date()
  },
  {
    id: "4",
    title: "Follow up - Marcus",
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    startTime: "09:00",
    type: "reminder",
    leadId: "2",
    leadName: "Marcus Johnson",
    leadStatus: "proposal",
    createdAt: new Date()
  },
  {
    id: "5",
    title: "Product demo",
    description: "Demo for potential client",
    date: new Date(),
    startTime: "11:30",
    endTime: "12:30",
    type: "meeting",
    createdAt: new Date()
  },
  {
    id: "6",
    title: "Review proposal",
    description: "Finalize pricing structure",
    date: new Date(),
    startTime: "16:00",
    endTime: "17:00",
    type: "task",
    kanbanCardId: "k1",
    kanbanCardTitle: "Research competitor pricing",
    kanbanCardType: "task",
    createdAt: new Date()
  }
];
