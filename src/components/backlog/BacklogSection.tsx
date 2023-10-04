import { type User, type Issue } from "@prisma/client";
import React from "react";

import AddIssueButton from "~/components/backlog/AddIssueButton";
import IssueItem from "./IssueItem";
import { useSession } from "next-auth/react";

export default function BacklogSection({
  issues,
  backlog,
  teamUsers,
}: {
  issues: Issue[];
  backlog: string;
  teamUsers: User[];
}) {
  const { data: session } = useSession();
  return (
    <>
      <div className="mx-5 mt-5 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-wide dark:text-white">
          {backlog === "sprint" ? "Sprint" : "Product"} Backlog
        </h1>
        {session?.user.role === "productOwner" && (
          <AddIssueButton backlog={backlog} teamUsers={teamUsers}/>
        )}
      </div>
      <div className="flex flex-col gap-1 p-5">
        {issues.map((issue) => (
          <IssueItem
            issue={issue}
            backlog={backlog}
            key={issue.id}
            teamUsers={teamUsers}
          />
        ))}
      </div>
    </>
  );
}
