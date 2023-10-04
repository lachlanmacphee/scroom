import React from "react";
import type { Issue } from "@prisma/client";
import { IssueItem } from "./IssueItem";
import { useDroppable } from "@dnd-kit/core";

interface ContainerProps {
  title?: string;
  id: string;
  issues: Issue[];
  role: string;
}

function BacklogContainer({ title, id, issues, role }: ContainerProps) {
  const { setNodeRef } = useDroppable({
    id: id,
    data: {
      type: "container",
    },
  });

  return (
    <div
      ref={setNodeRef}
      className="h-[400px]
  max-h-[400px]
  flex-col
  rounded-md
  border-2
  dark:bg-slate-700
  "
    >
      <h1 className="bg-gray-500 px-5 py-5 text-xl font-semibold tracking-wide dark:text-white">
        {title}:
      </h1>
      <div className="flex flex-grow flex-col gap-4 overflow-y-auto overflow-x-hidden p-2">
        {issues.map((issue) => (
          <IssueItem issue={issue} role={role} key={issue.id} />
        ))}
      </div>
    </div>
  );
}

export default BacklogContainer;
