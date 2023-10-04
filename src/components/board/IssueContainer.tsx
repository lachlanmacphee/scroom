import React from "react";
import type { Issue } from "@prisma/client";
import IssueItem from "~/components/board/IssueItem";
import { useDroppable } from "@dnd-kit/core";

interface IssueProps {
  issues: Issue[];
  containerId: string;
  containerTitle: string;
}

const IssueContainer = ({
  issues,
  containerId,
  containerTitle,
}: IssueProps) => {
  const { setNodeRef } = useDroppable({
    id: containerId,
  });

  return (
    <div ref={setNodeRef} className="flex flex-col items-center gap-4 md:w-1/3">
      <h2 className="mb-2 text-left text-lg font-semibold dark:text-white">
        {containerTitle} ({issues.length})
      </h2>

      <div
        id="dropContainer"
        className="flex  w-full max-w-sm flex-col gap-3 rounded-lg bg-white p-6 shadow dark:bg-gray-800 dark:text-white"
      >
        {issues.map((issue) => (
          <IssueItem key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  );
};
export default IssueContainer;
