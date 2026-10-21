import type { Lead } from "@/types/crm-types";

export const sampleLeads: Lead[] = [
	{
		id: "1",
		name: "Sarah Chen",
		email: "sarah@techcorp.com",
		company: "TechCorp Inc.",
		status: "qualified",
		note: "Interested in enterprise plan",
		info: "Met at SaaS conference, needs CRM integration",
		createdAt: new Date("2024-01-15"),
		updatedAt: new Date("2024-01-20")
	},
	{
		id: "2",
		name: "Marcus Johnson",
		email: "marcus@startupxyz.io",
		phone: "+1 (555) 987-6543",
		company: "StartupXYZ",
		status: "proposal",
		note: "Sent proposal last week",
		info: "Early-stage startup, budget conscious",
		createdAt: new Date("2024-01-10"),
		updatedAt: new Date("2024-01-22")
	},
	{
		id: "3",
		name: "David Kim",
		email: "david@globaltech.com",
		phone: "+1 (555) 456-7890",
		company: "GlobalTech Solutions",
		status: "negotiation",
		note: "Discussing contract terms",
		info: "Enterprise client, 500+ users",
		createdAt: new Date("2024-01-05"),
		updatedAt: new Date("2024-01-24")
	}
];
