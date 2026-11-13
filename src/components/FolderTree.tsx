"use client";

import { Folder, FolderOpen } from "lucide-react";
import { folderChildren } from "@/lib/booking";

interface FolderTreeProps {
  rootName: string;
}

export function FolderTree({ rootName }: FolderTreeProps) {
  const children = folderChildren();

  return (
    <div className="rounded-xl border border-plum/10 bg-cream/40 p-3 font-mono text-xs dark:border-cream/10 dark:bg-plum-deep/40 sm:text-[13px]">
      <div className="flex items-center gap-2 text-plum/55 dark:text-cream/50">
        <Folder className="h-3.5 w-3.5" strokeWidth={1.7} />
        <span>Clients</span>
      </div>
      <div className="ml-3 mt-1.5 border-l border-plum/12 pl-3 dark:border-cream/12">
        <div className="flex items-center gap-2 font-medium text-plum dark:text-cream">
          <FolderOpen className="h-3.5 w-3.5 text-honey" strokeWidth={1.7} />
          <span>{rootName}</span>
        </div>
        <ul className="ml-3 mt-1.5 space-y-1 border-l border-plum/12 pl-3 dark:border-cream/12">
          {children.map((name) => (
            <li
              key={name}
              className="flex items-center gap-2 text-plum/70 dark:text-cream/65"
            >
              <Folder className="h-3.5 w-3.5 shrink-0" strokeWidth={1.6} />
              <span>{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
