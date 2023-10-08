import React, { useState } from "react";
import type { Issue, User } from "@prisma/client";
import UpsertIssueModal from "./UpsertIssueModal";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import SummaryItem from "./SummaryItem";
import StatusDropdown from "./StatusDropdown";
import EditIssueButton from "./EditIssueButton";
import { useSession } from "next-auth/react";
import DeleteIssueButton from "./DeleteIssueButton";
import { type UpdateIssue } from "~/utils/types";

export function IssueItem({
  issue,
  teamUsers,
  updateIssue,
}: {
  issue: Issue;
  teamUsers: User[];
  updateIssue: UpdateIssue;
}) {
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const { data: session } = useSession();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: issue.id,
    data: {
      type: "issue",
      issue,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const editIssueHandler = () => {
    setIsIssueModalOpen(true);
  };

  if (session?.user.role === "productOwner") {
    return (
      <div
        {...listeners}
        ref={setNodeRef}
        {...attributes}
        style={style}
        className={clsx(
          "text-md flex h-[60px] cursor-grab flex-col items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-3 shadow dark:border-gray-700 dark:bg-gray-700 md:flex-row md:gap-0",
          isDragging && "opacity-50",
        )}
      >
        <SummaryItem issue={issue} updateIssue={updateIssue} />
        <div className="flex gap-2">
          <StatusDropdown issue={issue} updateIssue={updateIssue} />
          <EditIssueButton editHandler={editIssueHandler} />
          <DeleteIssueButton issue={issue} />
        </div>
        {isIssueModalOpen && (
          <UpsertIssueModal
            onClose={() => setIsIssueModalOpen(false)}
            issue={issue}
            teamUsers={teamUsers}
          />
        )}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={clsx(
        "text-md flex h-[60px] cursor-grab items-center justify-between rounded-md p-2 font-bold dark:bg-slate-700",
        isDragging && "opacity-50",
      )}
    >
      <SummaryItem issue={issue} updateIssue={updateIssue} />
      <div className="flex gap-4">
        <StatusDropdown issue={issue} updateIssue={updateIssue} />
        <EditIssueButton editHandler={editIssueHandler} />
      </div>
      {isIssueModalOpen && (
        <UpsertIssueModal
          onClose={() => setIsIssueModalOpen(false)}
          teamUsers={teamUsers}
          issue={issue}
        />
      )}
    </div>
  );
}
