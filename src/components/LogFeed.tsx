"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { LogEntry } from "@/lib/types";

interface LogFeedProps {
  entries: LogEntry[];
}

export function LogFeed({ entries }: LogFeedProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = !!prefersReducedMotion;

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [entries]);

  return (
    <div className="rounded-2xl border border-plum/10 bg-plum/[0.03] p-4 dark:border-cream/10 dark:bg-plum-deep/40">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-plum/50 dark:text-cream/45">
        Live log
      </p>
      <div
        ref={scrollerRef}
        className="max-h-36 space-y-1.5 overflow-y-auto font-mono text-[11px] leading-relaxed text-plum/70 dark:text-cream/65 sm:text-xs"
      >
        {entries.length === 0 ? (
          <p className="text-plum/40 dark:text-cream/35">
            Waiting for signature…
          </p>
        ) : (
          entries.map((entry) => (
            <motion.p
              key={entry.id}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.25 }}
            >
              <span className="text-honey-dark dark:text-honey">
                {entry.time}
              </span>{" "}
              {entry.message}
            </motion.p>
          ))
        )}
      </div>
    </div>
  );
}
