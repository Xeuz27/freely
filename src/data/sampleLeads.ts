import type { Lead } from "@/types/crm-types";

export const sampleLeads: Lead[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah@techcorp.com",
    company: "TechCorp Inc.",
    status: "qualified",
    note: "",
    info: "",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    name: "Marcus Johnson",
    email: "marcus@startupxyz.io",
    company: "StartupXYZ",
    status: "proposal",
    note: "",
    info: "",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "4",
    name: "David Kim",
    email: "david@globaltech.com",
    company: "GlobalTech Solutions",
    status: "negotiation",
    note: "",
    info: "",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
