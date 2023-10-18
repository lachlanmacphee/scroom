import React, { useState } from "react";
import type { Issue, Status, User } from "@prisma/client";
import { CSS } from "@dnd-kit/utilities";
import { useDraggable } from "@dnd-kit/core";
import IssueStoryPoints from "./IssueStoryPoints";
import UpsertIssueModal from "../backlog/UpsertIssueModal";

interface IssueProps {
  issue: Issue;
  teamUsers: User[];
  statuses: Status[];
}

export default function IssueItem({ issue, teamUsers, statuses }: IssueProps) {
  const [selected, setSelected] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  const handleSelection = () => {
    setSelected(!selected);
  };

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: issue.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <>
      {isIssueModalOpen && (
        <UpsertIssueModal
          onClose={() => setIsIssueModalOpen(false)}
          teamUsers={teamUsers}
          issue={issue}
          backlog="sprint"
          statuses={statuses}
        />
      )}
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="flex items-center justify-between gap-4 rounded-lg bg-white p-3 shadow dark:bg-gray-700"
        onClick={() => {
          setIsIssueModalOpen(true);
          handleSelection();
        }}
        aria-label={issue.summary}
        role="option"
        aria-selected={selected}
        draggable="true"
      >
        <p className="dark:text-white">{issue.summary}</p>
        <IssueStoryPoints issue={issue} />
      </div>
    </>
  );
}
