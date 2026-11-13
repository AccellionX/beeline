"use client";

import { FileSignature, PenLine } from "lucide-react";
import type { BookingFormData, ContractStatus } from "@/lib/types";
import { formatCurrency } from "@/lib/booking";

interface BookingFormProps {
  data: BookingFormData;
  contractStatus: ContractStatus;
  isRunning: boolean;
  onChange: (patch: Partial<BookingFormData>) => void;
  onSign: () => void;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-plum/55 dark:text-cream/50">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-md border border-plum/12 bg-white/80 px-3 py-2 text-sm text-plum outline-none transition focus:border-honey focus:ring-2 focus:ring-honey/25 dark:border-cream/15 dark:bg-plum-deep/60 dark:text-cream dark:focus:border-honey";

export function BookingForm({
  data,
  contractStatus,
  isRunning,
  onChange,
  onSign,
}: BookingFormProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-plum/10 bg-white/70 p-5 shadow-[0_18px_50px_-28px_rgba(36,27,47,0.45)] backdrop-blur-sm dark:border-cream/10 dark:bg-plum-mid/40 dark:shadow-[0_18px_50px_-28px_rgba(0,0,0,0.65)] sm:p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-honey/10 blur-2xl"
      />
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-honey">
            New booking
          </p>
          <h2 className="font-display text-2xl text-plum dark:text-cream sm:text-[1.7rem]">
            HoneyBook project{" "}
            <span className="text-plum/45 dark:text-cream/45">(sample)</span>
          </h2>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-plum/5 text-plum dark:bg-cream/10 dark:text-cream">
          <FileSignature className="h-5 w-5" strokeWidth={1.6} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Partner 1">
          <input
            className={inputClass}
            value={data.partner1}
            onChange={(e) => onChange({ partner1: e.target.value })}
          />
        </Field>
        <Field label="Partner 2">
          <input
            className={inputClass}
            value={data.partner2}
            onChange={(e) => onChange({ partner2: e.target.value })}
          />
        </Field>
        <Field label="Last name">
          <input
            className={inputClass}
            value={data.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
          />
        </Field>
        <Field label="Wedding date">
          <input
            type="date"
            className={inputClass}
            value={data.weddingDate}
            onChange={(e) => onChange({ weddingDate: e.target.value })}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Venue">
            <input
              className={inputClass}
              value={data.venue}
              onChange={(e) => onChange({ venue: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Guests">
          <input
            type="number"
            min={1}
            className={inputClass}
            value={data.guests}
            onChange={(e) =>
              onChange({ guests: Number(e.target.value) || 0 })
            }
          />
        </Field>
        <Field label={`Budget (${formatCurrency(data.budget)})`}>
          <input
            type="number"
            min={0}
            step={500}
            className={inputClass}
            value={data.budget}
            onChange={(e) =>
              onChange({ budget: Number(e.target.value) || 0 })
            }
          />
        </Field>
        <Field label="Lead planner">
          <input
            className={inputClass}
            value={data.leadPlanner}
            onChange={(e) => onChange({ leadPlanner: e.target.value })}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Inquiry notes">
            <textarea
              rows={3}
              className={`${inputClass} resize-y`}
              value={data.inquiryNotes}
              onChange={(e) => onChange({ inquiryNotes: e.target.value })}
            />
          </Field>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-plum/10 bg-cream/60 px-4 py-3 dark:border-cream/10 dark:bg-plum-deep/50">
        <div className="flex items-center gap-2.5">
          <PenLine className="h-4 w-4 text-plum/50 dark:text-cream/50" />
          <div>
            <p className="text-sm font-medium text-plum dark:text-cream">
              Contract
            </p>
            <p className="text-xs text-plum/50 dark:text-cream/45">
              Full-service wedding agreement
            </p>
          </div>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${
            contractStatus === "Signed"
              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
              : "bg-plum/8 text-plum/70 dark:bg-cream/10 dark:text-cream/70"
          }`}
        >
          {contractStatus}
        </span>
      </div>

      <button
        type="button"
        onClick={onSign}
        disabled={isRunning}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-honey px-4 py-3.5 text-sm font-semibold tracking-wide text-plum shadow-[0_12px_28px_-12px_rgba(201,138,18,0.85)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Sign contract
      </button>
    </section>
  );
}
