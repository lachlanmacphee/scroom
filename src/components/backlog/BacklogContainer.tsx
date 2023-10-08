import React from "react";
import type { Issue, User } from "@prisma/client";
import { IssueItem } from "./IssueItem";
import { useDroppable } from "@dnd-kit/core";
import { useSession } from "next-auth/react";
import AddIssueButton from "./AddIssueButton";
import { type UpdateIssue } from "~/utils/types";

interface ContainerProps {
  title?: string;
  id: string;
  issues: Issue[];
  teamUsers: User[];
  updateIssue: UpdateIssue;
}

function BacklogContainer({
  title,
  id,
  issues,
  teamUsers,
  updateIssue,
}: ContainerProps) {
  const { data: session } = useSession();
  const isProductOwner = session?.user.role === "productOwner";
  const { setNodeRef } = useDroppable({
    id: id,
    data: {
      type: "container",
    },
  });

  return (
    <>
      <div className="flex items-center justify-between px-2">
        <h1 className="text-xl font-semibold tracking-wide dark:text-white">
          {title}
        </h1>
        {isProductOwner && (
          <AddIssueButton teamUsers={teamUsers} backlog={id} />
        )}
      </div>
      <div
        ref={setNodeRef}
        className="min-h-[400px] rounded-lg p-6 dark:bg-gray-800"
      >
        <div className="flex flex-grow flex-col gap-4">
          {issues.map((issue) => (
            <IssueItem
              issue={issue}
              key={issue.id}
              teamUsers={teamUsers}
              updateIssue={updateIssue}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default BacklogContainer;
