/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useState } from "react";
import type { Issue, User, Status } from "@prisma/client";
import DeleteContainerModal from "../board/DeleteContainerModal";
import IssueItem from "~/components/board/IssueItem";
import { useDroppable } from "@dnd-kit/core";
import { ImBin } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import EditStatusNameModal from "./EditStatusNameModal";
import { defaultColumns } from "~/utils/constants";

interface IssueProps {
  issues: Issue[];
  containerValue: string;
  containerTitle: string;
  teamUsers: User[];
  containerId: string;
  deleteColumn: (id: string) => void;
  statuses: Status[];
}

const IssueContainer = ({
  issues,
  containerValue,
  containerTitle,
  teamUsers,
  containerId,
  deleteColumn,
  statuses,
}: IssueProps) => {
  const { setNodeRef } = useDroppable({
    id: containerValue,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);

  const openEditNameModal = () => {
    setIsEditNameModalOpen(true);
  };

  const closeEditNameModal = () => {
    setIsEditNameModalOpen(false);
  };

  return (
    <div
      ref={setNodeRef}
      id={`board-${containerValue}`}
      data-testid={`board-${containerValue}`}
      className="flex flex-col items-center gap-4 md:w-1/3"
    >
      <div className="flex items-center">
        <h2 className="mb-2 text-lg font-semibold dark:text-white">
          {containerTitle} ({issues.length})
        </h2>
        {!defaultColumns.some((column) => column.value === containerValue) && (
          <button
            onClick={() => {
              setShowDeleteModal(true);
            }}
            className="ml-2 inline-flex items-center rounded-lg bg-red-600 p-1.5 text-center text-sm font-medium text-white"
          >
            <ImBin fontSize="1em" />
          </button>
        )}
        <button
          onClick={openEditNameModal}
          className="ml-2 inline-flex items-center rounded-lg bg-blue-600 p-1.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <FiEdit fontSize="1em" />
        </button>
        {isEditNameModalOpen && (
          <EditStatusNameModal
            onClose={closeEditNameModal}
            statuses={statuses}
            id={containerId}
          />
        )}

        {showDeleteModal && (
          <DeleteContainerModal
            onClose={handleCloseDeleteModal}
            id={containerId}
            onDeleteContainer={deleteColumn}
            issues={issues}
            statuses={statuses}
          />
        )}
      </div>

      <div
        id="dropContainer"
        className="flex min-h-full w-full max-w-sm flex-col gap-3 rounded-lg bg-gray-100 p-6 shadow dark:bg-gray-800"
      >
        {issues.map((issue) => (
          <IssueItem
            key={issue.id}
            issue={issue}
            teamUsers={teamUsers}
            statuses={statuses}
          />
        ))}
      </div>
    </div>
  );
};
export default IssueContainer;
