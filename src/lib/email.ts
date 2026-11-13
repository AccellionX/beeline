import type { BookingFormData } from "./types";
import { coupleName, formatLongDate } from "./booking";

export function buildWelcomeEmail(data: BookingFormData): string {
  const couple = coupleName(data);
  const planner = data.leadPlanner || "your planner";
  const notes = data.inquiryNotes.toLowerCase();
  const lines: string[] = [
    `Dear ${data.partner1} & ${data.partner2},`,
    "",
    `Welcome to the Busy Bee's family. We're thrilled to officially begin planning your wedding on ${formatLongDate(data.weddingDate)} at ${data.venue}.`,
    "",
    `I'm ${planner}, and I'll be your lead planner for the ${couple} celebration. Your project is already set up across our planning tools so we can move quickly from signed contract to first decisions.`,
  ];

  if (notes.includes("garden")) {
    lines.push(
      "",
      "I noted your love of a garden feel — we'll weave soft greens, natural textures, and outdoor-inspired moments into the design direction from the start.",
    );
  }

  if (notes.includes("sunset")) {
    lines.push(
      "",
      "A sunset ceremony is a beautiful anchor. We'll protect golden-hour timing in the run sheet and build cocktail hour around that light.",
    );
  }

  if (
    /wheelchair|mobility|accessibility|accessible/.test(notes)
  ) {
    lines.push(
      "",
      "Accessibility will be planned around from day one — guest seating, pathway access, and vendor briefings included — so every loved one can celebrate comfortably.",
    );
  }

  lines.push(
    "",
    `Next up: a kickoff call to lock priorities for your ${data.guests}-guest celebration and align on budget pacing for ${new Intl.NumberFormat(
      "en-US",
      { style: "currency", currency: "USD", maximumFractionDigits: 0 },
    ).format(data.budget)}.`,
    "",
    "With warmth,",
    `${planner}`,
    "Busy Bee's Weddings & Events",
  );

  return lines.join("\n");
}
