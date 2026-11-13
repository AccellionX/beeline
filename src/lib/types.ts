export type ContractStatus = "Sent" | "Signed";

export type StepStatus = "waiting" | "running" | "done";

export type AutomationStepId =
  | "aisle"
  | "monday"
  | "drive"
  | "klaviyo"
  | "email";

export interface BookingFormData {
  partner1: string;
  partner2: string;
  lastName: string;
  weddingDate: string;
  venue: string;
  guests: number;
  budget: number;
  leadPlanner: string;
  inquiryNotes: string;
}

export interface PlanningTask {
  id: string;
  name: string;
  dueDate: Date;
  assignee: string;
}

export interface LogEntry {
  id: string;
  time: string;
  message: string;
}

export const AUTOMATION_STEPS: {
  id: AutomationStepId;
  app: string;
  summary: string;
}[] = [
  {
    id: "aisle",
    app: "Aisle Planner",
    summary: "Project created from your Full-Service Wedding template",
  },
  {
    id: "monday",
    app: "Monday.com",
    summary: "Onboarding item assigned to planner",
  },
  {
    id: "drive",
    app: "Google Drive",
    summary: "Client folder tree created",
  },
  {
    id: "klaviyo",
    app: "Klaviyo",
    summary: "Moved into Booked Couples flow",
  },
  {
    id: "email",
    app: "AI draft",
    summary: "Welcome email drafted for planner review",
  },
];
