import type { KanbanCard } from "@/types/kanban-types";

export const sampleKanbanCards: KanbanCard[] = [
  {
    id: "k1",
    title: "Research competitor pricing",
    type: "task",
    createdAt: new Date()
  },
  {
    id: "k2",
    title: "New onboarding flow",
    type: "idea",
    createdAt: new Date()
  },
  {
    id: "k3",
    title: "API performance metrics",
    type: "data",
    createdAt: new Date()
  }
];
