import type { Project } from "src/types/project-types";

export const sampleProjects: Project[] = [
	{
		id: "1",
		name: "Website Redesign",
		description: "Complete overhaul of the corporate website with new branding",
		status: "in_progress",
		priority: "high",
		ownerId: "John Smith",
		leadId: "1",
		startDate: new Date("2024-01-15"),
		deliveryDate: new Date("2024-03-15"),
		createdAt: new Date("2024-01-10"),
		updatedAt: new Date("2024-01-25")
	},
	{
		id: "2",
		name: "Mobile App Development",
		description: "Build native iOS and Android apps for the platform",
		status: "planning",
		priority: "urgent",
		ownerId: "Jane Doe",
		leadId: "2",
		startDate: new Date("2024-02-01"),
		deliveryDate: new Date("2024-06-30"),
		createdAt: new Date("2024-01-20"),
		updatedAt: new Date("2024-01-20")
	},
	{
		id: "3",
		name: "CRM Integration",
		description: "Integrate with third-party CRM systems",
		status: "review",
		priority: "medium",
		ownerId: "Mike Wilson",
		leadId: "3",
		startDate: new Date("2024-01-01"),
		deliveryDate: new Date("2024-02-28"),
		createdAt: new Date("2023-12-15"),
		updatedAt: new Date("2024-01-22")
	},
	{
		id: "4",
		name: "Data Migration",
		description: "Migrate legacy data to new infrastructure",
		status: "completed",
		priority: "low",
		ownerId: "Sarah Johnson",
		startDate: new Date("2023-11-01"),
		deliveryDate: new Date("2024-01-15"),
		createdAt: new Date("2023-10-20"),
		updatedAt: new Date("2024-01-15")
	},
	{
		id: "5",
		name: "Security Audit",
		description: "Comprehensive security review and penetration testing",
		status: "on_hold",
		priority: "high",
		ownerId: "Alex Brown",
		startDate: new Date("2024-02-15"),
		deliveryDate: new Date("2024-03-30"),
		createdAt: new Date("2024-01-18")
	},
	{
		id: "proj-1",
		name: "Website Redesign",
		status: "in_progress",
		priority: "high",
		startDate: new Date(),
		deliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
		createdAt: new Date()
	},
	{
		id: "proj-2",
		name: "Mobile App MVP",
		status: "planning",
		priority: "urgent",
		startDate: new Date(),
		deliveryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
		createdAt: new Date()
	}
];
