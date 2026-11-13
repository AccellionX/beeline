"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { StepStatus } from "@/lib/types";

interface AutomationCardProps {
  app: string;
  summary: string;
  status: StepStatus;
  icon: LucideIcon;
  active?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const statusStyles: Record<
  StepStatus,
  { label: string; className: string }
> = {
  waiting: {
    label: "Waiting",
    className:
      "bg-plum/8 text-plum/55 dark:bg-cream/10 dark:text-cream/50",
  },
  running: {
    label: "Running",
    className:
      "bg-honey/20 text-honey-dark dark:bg-honey/25 dark:text-honey",
  },
  done: {
    label: "Done",
    className:
      "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  },
};

export function AutomationCard({
  app,
  summary,
  status,
  icon: Icon,
  active = false,
  fullWidth = false,
  children,
}: AutomationCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = !!prefersReducedMotion;
  const pill = statusStyles[status];

  return (
    <motion.article
      layout={false}
      animate={
        reduceMotion
          ? undefined
          : status === "running"
            ? {
                boxShadow: [
                  "0 0 0 1px rgba(201,138,18,0.35), 0 0 0 0 rgba(201,138,18,0)",
                  "0 0 0 1px rgba(201,138,18,0.55), 0 0 22px 2px rgba(201,138,18,0.28)",
                  "0 0 0 1px rgba(201,138,18,0.35), 0 0 0 0 rgba(201,138,18,0)",
                ],
              }
            : { boxShadow: "0 0 0 0 rgba(0,0,0,0)" }
      }
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 1.4, repeat: status === "running" ? Infinity : 0 }
      }
      className={`relative overflow-hidden rounded-2xl border bg-white/75 p-4 backdrop-blur-sm dark:bg-plum-mid/45 sm:p-5 ${
        fullWidth ? "sm:col-span-2" : ""
      } ${
        status === "running"
          ? "border-honey/60"
          : status === "done"
            ? "border-emerald-500/25 dark:border-emerald-400/20"
            : "border-plum/10 dark:border-cream/10"
      } ${active ? "ring-1 ring-honey/40" : ""}`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
              status === "done"
                ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"
                : status === "running"
                  ? "bg-honey/15 text-honey-dark dark:text-honey"
                  : "bg-plum/6 text-plum/55 dark:bg-cream/8 dark:text-cream/55"
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={1.7} />
          </div>
          <div>
            <h3 className="font-display text-lg leading-tight text-plum dark:text-cream">
              {app}
            </h3>
            <p className="mt-0.5 text-xs text-plum/55 dark:text-cream/50">
              {summary}
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${pill.className}`}
        >
          {pill.label}
        </span>
      </div>

      <div
        className={`transition-opacity duration-300 ${
          status === "waiting" ? "opacity-45" : "opacity-100"
        }`}
      >
        {children}
      </div>
    </motion.article>
  );
}
