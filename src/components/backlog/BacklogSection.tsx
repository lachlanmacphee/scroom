import { type Issue } from "@prisma/client";
import React from "react";

import AddIssueButton from "~/components/backlog/AddIssueButton";
import IssueItem from "./IssueItem";

export default function BacklogSection({
  issues,
  backlog,
}: {
  issues: Issue[];
  backlog: string;
}) {
  return (
    <>
      <div className="mx-5 mt-5 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-wide dark:text-white">
          {backlog === "sprint" ? "Sprint" : "Product"} Backlog
        </h1>
        <AddIssueButton backlog={backlog} />
      </div>
      <div className="flex flex-col gap-1 p-5">
        {issues.map((issue) => (
          <IssueItem issue={issue} key={issue.id} />
        ))}
      </div>
    </>
  );
}
