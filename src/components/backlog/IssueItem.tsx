import React, { useState } from "react";
import type { Issue, User, Status, Sprint } from "@prisma/client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import SummaryItem from "./SummaryItem";
import StatusDropdown from "./StatusDropdown";
import EditIssueButton from "./EditIssueButton";
import DeleteIssueButton from "./DeleteIssueButton";
import { type UpdateIssue } from "~/utils/types";
import NewUpsertIssueModal from "./NewUpsertIssueModal";
import { useSession } from "next-auth/react";

export function IssueItem({
  issue,
  teamUsers,
  updateIssue,
  statuses,
  sprint,
}: {
  issue: Issue;
  teamUsers: User[];
  updateIssue: UpdateIssue;
  statuses: Status[];
  sprint?: Sprint;
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

  const summaryIssueHandler = () => {
    setIsIssueModalOpen(true);
  };

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
        <StatusDropdown
          issue={issue}
          updateIssue={updateIssue}
          statuses={statuses}
        />
        <EditIssueButton editHandler={summaryIssueHandler} />
        <DeleteIssueButton issue={issue} />
      </div>
      {isIssueModalOpen && (
        <NewUpsertIssueModal
          onClose={() => setIsIssueModalOpen(false)}
          issue={issue}
          teamUsers={teamUsers}
          currentUserId={session?.user.id}
          sprint={sprint}
          statuses={statuses}
        />
      )}
    </div>
  );
}
