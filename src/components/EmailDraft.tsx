"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Check, Pencil } from "lucide-react";

interface EmailDraftProps {
  fullText: string;
  planner: string;
  isTyping: boolean;
  showFull: boolean;
  onApprove: () => void;
  onEdit: () => void;
  isEditing: boolean;
  draftOverride: string;
  onDraftChange: (value: string) => void;
}

export function EmailDraft({
  fullText,
  planner,
  isTyping,
  showFull,
  onApprove,
  onEdit,
  isEditing,
  draftOverride,
  onDraftChange,
}: EmailDraftProps) {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [typed, setTyped] = useState(showFull ? fullText : "");
  const reduceMotion = mounted && !!prefersReducedMotion;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (showFull && !isTyping) {
      setTyped(fullText);
      return;
    }

    if (!isTyping) {
      if (!showFull) setTyped("");
      return;
    }

    if (reduceMotion) {
      setTyped(fullText);
      return;
    }

    setTyped("");
    let i = 0;
    const id = window.setInterval(() => {
      i += 2;
      setTyped(fullText.slice(0, i));
      if (i >= fullText.length) window.clearInterval(id);
    }, 18);

    return () => window.clearInterval(id);
  }, [fullText, isTyping, showFull, reduceMotion]);

  const display = isEditing ? draftOverride : isTyping || showFull ? typed : fullText;

  return (
    <div className="space-y-3">
      <div className="inline-flex items-center rounded-full bg-plum/6 px-2.5 py-1 text-[11px] font-medium text-plum/65 dark:bg-cream/10 dark:text-cream/60">
        Ready for {planner || "planner"} to review, never sent automatically
      </div>

      {isEditing ? (
        <textarea
          rows={12}
          className="w-full rounded-xl border border-honey/40 bg-white/90 p-3 font-mono text-xs leading-relaxed text-plum outline-none focus:ring-2 focus:ring-honey/30 dark:bg-plum-deep/60 dark:text-cream sm:text-sm"
          value={draftOverride}
          onChange={(e) => onDraftChange(e.target.value)}
        />
      ) : (
        <pre className="min-h-[180px] whitespace-pre-wrap rounded-xl border border-plum/10 bg-cream/50 p-3 font-mono text-xs leading-relaxed text-plum/85 dark:border-cream/10 dark:bg-plum-deep/50 dark:text-cream/80 sm:text-sm">
          {display}
          {isTyping && !reduceMotion && typed.length < fullText.length ? (
            <span className="ml-0.5 inline-block h-3.5 w-[2px] animate-pulse bg-honey" />
          ) : null}
        </pre>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onApprove}
          className="inline-flex items-center gap-1.5 rounded-lg bg-plum px-3 py-2 text-xs font-semibold text-cream transition hover:bg-plum/90 dark:bg-cream dark:text-plum"
        >
          <Check className="h-3.5 w-3.5" strokeWidth={2} />
          Approve
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 rounded-lg border border-plum/15 bg-white/70 px-3 py-2 text-xs font-semibold text-plum transition hover:border-honey/50 dark:border-cream/15 dark:bg-plum-deep/40 dark:text-cream"
        >
          <Pencil className="h-3.5 w-3.5" strokeWidth={1.8} />
          {isEditing ? "Done editing" : "Edit"}
        </button>
      </div>
    </div>
  );
}
