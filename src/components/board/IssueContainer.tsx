import React from "react";
import type { Issue, User } from "@prisma/client";
import IssueItem from "~/components/board/IssueItem";
import { useDroppable } from "@dnd-kit/core";

interface IssueProps {
  issues: Issue[];
  containerId: string;
  containerTitle: string;
  teamUsers: User[];
}

const IssueContainer = ({
  issues,
  containerId,
  containerTitle,
  teamUsers,
}: IssueProps) => {
  const { setNodeRef } = useDroppable({
    id: containerId,
  });

  return (
    <div
      ref={setNodeRef}
      id={`board-${containerId}`}
      className="flex flex-col items-center gap-4 md:w-1/3"
    >
      <h2 className="mb-2 text-left text-lg font-semibold dark:text-white">
        {containerTitle} ({issues.length})
      </h2>

      <div
        id="dropContainer"
        className="flex min-h-full w-full max-w-sm flex-col gap-3 rounded-lg bg-white p-6 shadow dark:bg-gray-800"
      >
        {issues.map((issue) => (
          <IssueItem key={issue.id} issue={issue} teamUsers={teamUsers} />
        ))}
      </div>
    </div>
  );
};
export default IssueContainer;
