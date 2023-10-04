import { type Team } from "@prisma/client";
import { HiOutlinePencil } from "react-icons/hi";
import { useState } from "react";
import TeamDetailsModal from "./TeamDetailsModal";

export default function TeamDetailsButton({ team }: { team: Team }) {
  const [isTeamDetailsModalOpen, setIsTeamDetailsModalOpen] = useState(false);

  return (
    <>
      <button
        data-testid="editTeamDetailsButton"
        onClick={() => setIsTeamDetailsModalOpen(true)}
      >
        <HiOutlinePencil size="1.75em" className="dark:stroke-white" />
      </button>
      {isTeamDetailsModalOpen && (
        <TeamDetailsModal
          team={team}
          onClose={() => setIsTeamDetailsModalOpen(false)}
        />
      )}
    </>
  );
}
