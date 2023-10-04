import React from "react";
import type { Issue } from "@prisma/client";
import { CSS } from "@dnd-kit/utilities";
import { useDraggable } from "@dnd-kit/core";

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
      className="mb-2 rounded border border-blue-800 p-2"
    >
      {issue.summary}
    </div>
  );
}
