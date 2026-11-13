"use client";

import type { PlanningTask } from "@/lib/types";
import { formatShortDate } from "@/lib/booking";

interface TaskTableProps {
  tasks: PlanningTask[];
  planner: string;
}

export function TaskTable({ tasks, planner }: TaskTableProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-plum/70 dark:text-cream/65">
        Onboarding item assigned to{" "}
        <span className="font-medium text-plum dark:text-cream">{planner}</span>
      </p>
      <div className="overflow-hidden rounded-xl border border-plum/10 dark:border-cream/10">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-plum/[0.04] text-[10px] uppercase tracking-[0.12em] text-plum/50 dark:bg-cream/[0.04] dark:text-cream/45">
            <tr>
              <th className="px-3 py-2 font-medium">Task</th>
              <th className="px-3 py-2 font-medium">Due</th>
              <th className="hidden px-3 py-2 font-medium sm:table-cell">
                Owner
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="border-t border-plum/8 text-plum/80 dark:border-cream/8 dark:text-cream/75"
              >
                <td className="px-3 py-2 font-medium text-plum dark:text-cream">
                  {task.name}
                </td>
                <td className="whitespace-nowrap px-3 py-2">
                  {formatShortDate(task.dueDate)}
                </td>
                <td className="hidden px-3 py-2 sm:table-cell">
                  {task.assignee}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
