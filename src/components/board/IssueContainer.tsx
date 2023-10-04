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
    <div ref={setNodeRef} className="w-full p-4 md:w-1/3">
      <div>
        <h2 className="mb-2 text-lg font-semibold dark:text-white">
          {containerTitle} ({issues.length})
        </h2>
      </div>
      <div id={"dropContainer"} className="mt-2 block max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800 dark:text-white">
        {issues.map((issue) => (
          <IssueItem key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  );
};
export default IssueContainer;
