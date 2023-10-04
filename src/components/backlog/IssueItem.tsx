import React, { useState } from "react";
import type { Issue, User } from "@prisma/client";
import { useRouter } from "next/router";
import { FiEdit } from "react-icons/fi";
import UpsertIssueModal from "./UpsertIssueModal";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import SummaryItem from "./SummaryItem";
import StatusDropDown from "./StatusDropDown";
import EditIssueButton from "./EditIssueButton";

export function IssueItem({
  issue,
  role,
  teamUsers,
}: {
  issue: Issue;
  role: string;
  teamUsers: User[];
}) {
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

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

  const router = useRouter();

  const updateIssueHandler = async (status: string) => {
    await updateIssue(issue.id, issue.summary, status, issue.backlog);
  };

  const editIssueHandler = () => {
    setIsIssueModalOpen(true);
  };

  const updateIssue = async (
    issueID: string,
    summary: string,
    status: string,
    backlog: string,
  ) => {
    try {
      const body = { issueID, summary, status, backlog };
      await fetch(`/api/issues/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await router.replace(router.asPath);
    } catch (error) {
      console.error(error);
    }
  };

  if (role === "productOwner") {
    return (
      <div
        {...listeners}
        ref={setNodeRef}
        {...attributes}
        style={style}
        className={clsx(
          "text-md flex h-[60px] cursor-grab items-center justify-between rounded-md border-2 p-3 font-bold",
          isDragging && "opacity-50",
        )}
      >
        <SummaryItem issue={issue} updateIssue={updateIssue} />
        <StatusDropDown issue={issue} clickHandler={updateIssueHandler} />
        <EditIssueButton editHandler={editIssueHandler} />
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
        "text-md flex h-[60px] cursor-grab items-center justify-between rounded-md rounded-b-none border-2 p-3 font-bold",
        isDragging && "opacity-50",
      )}
    >
      <SummaryItem issue={issue} updateIssue={updateIssue} />
      <StatusDropDown issue={issue} clickHandler={updateIssueHandler} />
      <EditIssueButton editHandler={editIssueHandler} />
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
