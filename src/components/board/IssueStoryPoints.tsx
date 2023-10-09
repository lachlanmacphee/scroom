import React from "react";
import type { Issue } from "@prisma/client";

export default function IssueStoryPoints({ issue }: { issue: Issue }) {
  return (
    <div
      data-testid="IssueStoryPoints"
      className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-black"
    >
      <span>{issue.estimate ?? "-"}</span>
    </div>
  );
}
