import type { BookingFormData, PlanningTask } from "./types";

export const DEFAULT_BOOKING: BookingFormData = {
  partner1: "Sofia",
  partner2: "James",
  lastName: "Reyes",
  weddingDate: "2027-06-12",
  venue: "The Riverside Hotel, Fort Lauderdale",
  guests: 140,
  budget: 45000,
  leadPlanner: "Bettina",
  inquiryNotes:
    "Love a garden feel, want a sunset ceremony, Sofia's grandmother uses a wheelchair",
};

export function coupleName(data: BookingFormData): string {
  return `${data.partner1} & ${data.partner2} ${data.lastName}`.trim();
}

export function projectName(data: BookingFormData): string {
  return `${data.lastName} Wedding`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatLongDate(isoDate: string): string {
  const date = parseLocalDate(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function parseLocalDate(isoDate: string): Date {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return startOfDay(next);
}

/** Clamp past due dates to tomorrow so the demo always looks actionable. */
export function clampDueDate(candidate: Date, now = new Date()): Date {
  const tomorrow = addDays(startOfDay(now), 1);
  return candidate < tomorrow ? tomorrow : startOfDay(candidate);
}

const TASK_DEFS: {
  id: string;
  name: string;
  offsetFromWedding?: number;
  offsetFromToday?: number;
}[] = [
  { id: "kickoff", name: "Kickoff call", offsetFromToday: 3 },
  { id: "vendors", name: "Vendor shortlist", offsetFromWedding: -270 },
  { id: "walkthrough", name: "Venue walkthrough", offsetFromWedding: -180 },
  { id: "timeline", name: "Timeline first draft", offsetFromWedding: -60 },
  {
    id: "confirm",
    name: "Final vendor confirmations",
    offsetFromWedding: -14,
  },
  { id: "runsheet", name: "Day-of run sheet", offsetFromWedding: -7 },
];

export function buildPlanningTasks(
  data: BookingFormData,
  now = new Date(),
): PlanningTask[] {
  const wedding = parseLocalDate(data.weddingDate);
  return TASK_DEFS.map((task) => {
    let raw: Date;
    if (typeof task.offsetFromToday === "number") {
      raw = addDays(startOfDay(now), task.offsetFromToday);
    } else {
      raw = addDays(wedding, task.offsetFromWedding ?? 0);
    }
    return {
      id: task.id,
      name: task.name,
      dueDate: clampDueDate(raw, now),
      assignee: data.leadPlanner || "Planner",
    };
  });
}

export function folderRootName(data: BookingFormData): string {
  return `${data.lastName} Wedding · ${data.weddingDate}`;
}

export function folderChildren(): string[] {
  return [
    "01 Contract & Invoices",
    "02 Timeline",
    "03 Vendors",
    "04 Inspiration",
    "05 Day-of",
  ];
}

export function nowTimeLabel(date = new Date()): string {
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
