import React from "react";
import type { Issue } from "@prisma/client";
import { CSS } from "@dnd-kit/utilities";
import { useDraggable } from "@dnd-kit/core";
import IssueStoryPoints from "./IssueStoryPoints";

interface IssueProps {
  issue: Issue;
}
export default function IssueItem({ issue }: IssueProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: issue.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between gap-4 rounded-lg bg-white p-3 shadow dark:bg-gray-700"
    >
      <p>{issue.summary}</p>
      <IssueStoryPoints issue={issue} />
    </div>
  );
}
