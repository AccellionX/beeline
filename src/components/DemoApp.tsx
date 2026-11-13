"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CalendarDays,
  FolderKanban,
  LayoutList,
  Mail,
  RefreshCw,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import { BookingForm } from "@/components/BookingForm";
import { AutomationCard } from "@/components/AutomationCard";
import { TaskTable } from "@/components/TaskTable";
import { FolderTree } from "@/components/FolderTree";
import { EmailDraft } from "@/components/EmailDraft";
import { LogFeed } from "@/components/LogFeed";
import {
  DEFAULT_BOOKING,
  buildPlanningTasks,
  coupleName,
  folderRootName,
  formatCurrency,
  formatLongDate,
  nowTimeLabel,
  projectName,
} from "@/lib/booking";
import { buildWelcomeEmail } from "@/lib/email";
import {
  AUTOMATION_STEPS,
  type AutomationStepId,
  type BookingFormData,
  type ContractStatus,
  type LogEntry,
  type StepStatus,
} from "@/lib/types";

const STEP_MS = 900;

const doneStatuses = (): Record<AutomationStepId, StepStatus> => ({
  aisle: "done",
  monday: "done",
  drive: "done",
  klaviyo: "done",
  email: "done",
});

const waitingStatuses = (): Record<AutomationStepId, StepStatus> => ({
  aisle: "waiting",
  monday: "waiting",
  drive: "waiting",
  klaviyo: "waiting",
  email: "waiting",
});

const ICONS = {
  aisle: LayoutList,
  monday: CalendarDays,
  drive: FolderKanban,
  klaviyo: Mail,
  email: Sparkles,
} as const;

const NEXT_STEPS = [
  {
    title: "Faster inquiry replies",
    body: "A new HoneyBook inquiry gets an AI-drafted reply in minutes; the planner approves.",
  },
  {
    title: "One pipeline view",
    body: "HoneyBook stage changes update Monday so nothing slips between tools.",
  },
  {
    title: "Payment alerts",
    body: "Paid invoices update Monday and notify the planner right away.",
  },
  {
    title: "Course to clients",
    body: "Kajabi course buyers get tagged in Klaviyo and offered full-service planning.",
  },
  {
    title: "SOPs",
    body: "Every flow comes with a short written process for training your team.",
  },
];

function initialLogs(data: BookingFormData): LogEntry[] {
  const couple = coupleName(data);
  return [
    {
      id: "boot-1",
      time: "12:04:01",
      message: `Zapier received booking for ${couple}`,
    },
    {
      id: "boot-2",
      time: "12:04:02",
      message: "Aisle Planner project created",
    },
    {
      id: "boot-3",
      time: "12:04:03",
      message: `Monday.com onboarding assigned to ${data.leadPlanner}`,
    },
    {
      id: "boot-4",
      time: "12:04:04",
      message: `Google Drive folder ready: ${folderRootName(data)}`,
    },
    {
      id: "boot-5",
      time: "12:04:05",
      message: "Klaviyo: moved to Booked Couples flow",
    },
    {
      id: "boot-6",
      time: "12:04:06",
      message: "AI welcome draft ready for review",
    },
  ];
}

/** Stable SSR fallback so Kickoff dates match until the client mounts. */
const DEMO_TODAY = new Date(2026, 10, 13);

export function DemoApp() {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date>(DEMO_TODAY);
  const [data, setData] = useState<BookingFormData>(DEFAULT_BOOKING);
  const [contractStatus, setContractStatus] =
    useState<ContractStatus>("Signed");
  const [statuses, setStatuses] =
    useState<Record<AutomationStepId, StepStatus>>(doneStatuses);
  const [activeStep, setActiveStep] = useState<AutomationStepId | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [completedOnce, setCompletedOnce] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>(() =>
    initialLogs(DEFAULT_BOOKING),
  );
  const [emailTyping, setEmailTyping] = useState(false);
  const [emailShowFull, setEmailShowFull] = useState(true);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailOverride, setEmailOverride] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [connectorProgress, setConnectorProgress] = useState(1);
  const runIdRef = useRef(0);
  const toastTimer = useRef<number | null>(null);
  const logSeq = useRef(0);

  const reduceMotion = mounted && !!prefersReducedMotion;
  const tasks = useMemo(() => buildPlanningTasks(data, now), [data, now]);
  const welcomeEmail = useMemo(() => buildWelcomeEmail(data), [data]);
  const weddingYear = data.weddingDate.slice(0, 4) || "2027";

  useEffect(() => {
    setMounted(true);
    setNow(new Date());
  }, []);

  useEffect(() => {
    if (!isEditingEmail) setEmailOverride(welcomeEmail);
  }, [welcomeEmail, isEditingEmail]);

  const pushLog = useCallback((message: string) => {
    logSeq.current += 1;
    setLogs((prev) => [
      ...prev,
      {
        id: `log-${logSeq.current}`,
        time: nowTimeLabel(),
        message,
      },
    ]);
  }, []);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2800);
  }, []);

  const runSequence = useCallback(async () => {
    const id = ++runIdRef.current;
    const delay = (ms: number) =>
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, reduceMotion ? 0 : ms);
      });

    setIsRunning(true);
    setCompletedOnce(false);
    setContractStatus("Signed");
    setStatuses(waitingStatuses());
    setActiveStep(null);
    setLogs([]);
    setEmailTyping(false);
    setEmailShowFull(false);
    setIsEditingEmail(false);
    setConnectorProgress(0);

    await delay(280);
    if (runIdRef.current !== id) return;

    pushLog(`Zapier received booking for ${coupleName(data)}`);
    setConnectorProgress(0.12);

    const stepOrder = AUTOMATION_STEPS.map((s) => s.id);
    for (let i = 0; i < stepOrder.length; i++) {
      if (runIdRef.current !== id) return;
      const step = stepOrder[i];
      setActiveStep(step);
      setStatuses((prev) => ({ ...prev, [step]: "running" }));
      setConnectorProgress((i + 1) / stepOrder.length);

      if (step === "aisle") {
        pushLog("Aisle Planner project created");
      } else if (step === "monday") {
        pushLog(
          `Monday.com onboarding assigned to ${data.leadPlanner || "planner"}`,
        );
      } else if (step === "drive") {
        pushLog(`Google Drive folder ready: ${folderRootName(data)}`);
      } else if (step === "klaviyo") {
        pushLog("Klaviyo: moved to Booked Couples flow");
      } else if (step === "email") {
        setEmailTyping(true);
        pushLog("AI welcome draft ready for review");
      }

      await delay(STEP_MS);
      if (runIdRef.current !== id) return;

      setStatuses((prev) => ({ ...prev, [step]: "done" }));
      if (step === "email") {
        setEmailTyping(false);
        setEmailShowFull(true);
      }
    }

    setActiveStep(null);
    setIsRunning(false);
    setCompletedOnce(true);
    setConnectorProgress(1);
  }, [data, pushLog, reduceMotion]);

  const onSign = () => {
    if (isRunning) return;
    setContractStatus("Sent");
    window.setTimeout(() => {
      void runSequence();
    }, reduceMotion ? 0 : 180);
  };

  const onChange = (patch: Partial<BookingFormData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-cream dark:bg-plum"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(ellipse_at_top,_rgba(201,138,18,0.16),_transparent_55%),linear-gradient(180deg,_rgba(36,27,47,0.04),_transparent_40%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(201,138,18,0.18),_transparent_50%),linear-gradient(180deg,_rgba(255,255,255,0.04),_transparent_45%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23241b2f' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <header className="mx-auto max-w-6xl px-4 pb-3 pt-8 sm:px-6 sm:pt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-honey">
              Busy Bee&apos;s Weddings &amp; Events
            </p>
            <h1 className="mt-1 font-display text-4xl tracking-tight text-plum dark:text-cream sm:text-5xl">
              BeeLine
            </h1>
            <p className="mt-2 max-w-xl font-display text-xl italic text-plum/70 dark:text-cream/70 sm:text-2xl">
              Signed → planning ready
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-plum/10 bg-white/60 px-3 py-1.5 text-xs text-plum/65 backdrop-blur dark:border-cream/10 dark:bg-plum-mid/50 dark:text-cream/60">
            <Workflow className="h-3.5 w-3.5 text-honey" />
            Sales demo · Fort Lauderdale
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-honey/25 bg-honey/10 px-4 py-2.5 text-sm text-plum/75 dark:border-honey/30 dark:bg-honey/10 dark:text-cream/75">
          Concept demo with sample data. The real build runs on your own
          accounts through your existing Zapier.
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
          <BookingForm
            data={data}
            contractStatus={contractStatus}
            isRunning={isRunning}
            onChange={onChange}
            onSign={onSign}
          />

          <section className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl border border-plum/10 bg-white/65 px-4 py-3 backdrop-blur-sm dark:border-cream/10 dark:bg-plum-mid/40">
              <div className="flex flex-wrap items-center gap-2 text-sm text-plum dark:text-cream">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-honey/15 px-2.5 py-1 text-xs font-semibold text-honey-dark dark:text-honey">
                  <Zap className="h-3.5 w-3.5" />
                  Trigger
                </span>
                <span className="font-medium">
                  HoneyBook project booked → Zapier → 5 apps
                </span>
              </div>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-plum/8 dark:bg-cream/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-honey/70 via-honey to-honey/80"
                  animate={{
                    width: `${Math.max(connectorProgress * 100, isRunning ? 8 : 0)}%`,
                  }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.45,
                    ease: "easeOut",
                  }}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <AutomationCard
                app="Aisle Planner"
                summary="Project created from your Full-Service Wedding template"
                status={statuses.aisle}
                icon={ICONS.aisle}
                active={activeStep === "aisle"}
              >
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-sm">
                  <dt className="text-plum/45 dark:text-cream/40">Project</dt>
                  <dd className="font-medium text-plum dark:text-cream">
                    {projectName(data)}
                  </dd>
                  <dt className="text-plum/45 dark:text-cream/40">Date</dt>
                  <dd className="text-plum/80 dark:text-cream/75">
                    {formatLongDate(data.weddingDate)}
                  </dd>
                  <dt className="text-plum/45 dark:text-cream/40">Venue</dt>
                  <dd className="text-plum/80 dark:text-cream/75">
                    {data.venue}
                  </dd>
                  <dt className="text-plum/45 dark:text-cream/40">Guests</dt>
                  <dd className="text-plum/80 dark:text-cream/75">
                    {data.guests}
                  </dd>
                  <dt className="text-plum/45 dark:text-cream/40">Budget</dt>
                  <dd className="text-plum/80 dark:text-cream/75">
                    {formatCurrency(data.budget)}
                  </dd>
                </dl>
              </AutomationCard>

              <AutomationCard
                app="Monday.com"
                summary={`Onboarding item assigned to ${data.leadPlanner || "planner"}`}
                status={statuses.monday}
                icon={ICONS.monday}
                active={activeStep === "monday"}
              >
                <TaskTable tasks={tasks} planner={data.leadPlanner} />
              </AutomationCard>

              <AutomationCard
                app="Google Drive"
                summary="Client folder tree created"
                status={statuses.drive}
                icon={ICONS.drive}
                active={activeStep === "drive"}
              >
                <FolderTree rootName={folderRootName(data)} />
              </AutomationCard>

              <AutomationCard
                app="Klaviyo"
                summary="Moved into Booked Couples flow"
                status={statuses.klaviyo}
                icon={ICONS.klaviyo}
                active={activeStep === "klaviyo"}
              >
                <ul className="space-y-1.5 text-sm text-plum/75 dark:text-cream/70">
                  <li>
                    <span className="text-plum/45 dark:text-cream/40">
                      Removed from:
                    </span>{" "}
                    Inquiry nurture list
                  </li>
                  <li>
                    <span className="text-plum/45 dark:text-cream/40">
                      Added to:
                    </span>{" "}
                    Booked Couples flow
                  </li>
                  <li>
                    <span className="text-plum/45 dark:text-cream/40">
                      Tag:
                    </span>{" "}
                    booked-{weddingYear}
                  </li>
                  <li>
                    <span className="text-plum/45 dark:text-cream/40">
                      First email:
                    </span>{" "}
                    Welcome to the Busy Bee&apos;s family
                  </li>
                </ul>
              </AutomationCard>

              <AutomationCard
                app="AI draft"
                summary="Welcome email drafted for planner review"
                status={statuses.email}
                icon={ICONS.email}
                active={activeStep === "email"}
                fullWidth
              >
                <EmailDraft
                  fullText={welcomeEmail}
                  planner={data.leadPlanner}
                  isTyping={emailTyping}
                  showFull={emailShowFull || statuses.email === "done"}
                  onApprove={() =>
                    showToast("Approved, queued in HoneyBook (simulated)")
                  }
                  onEdit={() => {
                    if (!isEditingEmail) setEmailOverride(welcomeEmail);
                    setIsEditingEmail((v) => !v);
                  }}
                  isEditing={isEditingEmail}
                  draftOverride={emailOverride}
                  onDraftChange={setEmailOverride}
                />
              </AutomationCard>
            </div>

            <LogFeed entries={logs} />

            {completedOnce && !isRunning ? (
              <motion.button
                type="button"
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => void runSequence()}
                className="inline-flex items-center gap-2 rounded-xl border border-plum/12 bg-white/70 px-4 py-2.5 text-sm font-semibold text-plum transition hover:border-honey/40 dark:border-cream/15 dark:bg-plum-mid/50 dark:text-cream"
              >
                <RefreshCw className="h-4 w-4" strokeWidth={1.8} />
                Run it again
              </motion.button>
            ) : null}
          </section>
        </div>

        <section className="mt-12 grid gap-3 sm:grid-cols-3">
          {[
            "0 fields retyped by your team",
            "5 systems set up from one signature",
            "6 planning tasks dated from the wedding day",
          ].map((stat) => (
            <div
              key={stat}
              className="rounded-2xl border border-plum/10 bg-white/60 px-5 py-6 text-center dark:border-cream/10 dark:bg-plum-mid/40"
            >
              <p className="font-display text-xl text-plum dark:text-cream sm:text-2xl">
                {stat}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-14">
          <h2 className="font-display text-3xl text-plum dark:text-cream">
            What comes next
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-plum/60 dark:text-cream/55">
            After the signed-contract zap, the same stack can quiet the rest of
            the week.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {NEXT_STEPS.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-plum/10 bg-white/55 p-4 dark:border-cream/10 dark:bg-plum-mid/35"
              >
                <h3 className="font-display text-lg text-plum dark:text-cream">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-plum/60 dark:text-cream/55">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-plum/10 bg-white/40 py-8 dark:border-cream/10 dark:bg-plum-deep/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 text-sm text-plum/70 dark:text-cream/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            Prepared for Bettina Benizri by Ali Tariq, Co-Founder &amp; COO,
            AccellionX
          </p>
          <div className="flex gap-4">
            <a
              className="underline decoration-honey/50 underline-offset-4 transition hover:text-plum dark:hover:text-cream"
              href="https://www.linkedin.com/in/ali-tariq07/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a
              className="underline decoration-honey/50 underline-offset-4 transition hover:text-plum dark:hover:text-cream"
              href="https://www.upwork.com/freelancers/~01e605b0db4978f259"
              target="_blank"
              rel="noreferrer"
            >
              Upwork
            </a>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {toast ? (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 12 }}
            className="fixed bottom-5 left-1/2 z-50 max-w-[90vw] -translate-x-1/2 rounded-full border border-honey/30 bg-plum px-4 py-2.5 text-sm text-cream shadow-lg"
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
