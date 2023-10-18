import React, { useState } from "react";
import type { Sprint } from "@prisma/client";
import NewSprintModal from "./NewSprintModal";

export default function NewSprintButton({ sprints }: { sprints: Sprint[] }) {
  const [showNewSprintModal, setShowNewSprintModal] = useState(false);

  return (
    <>
      {showNewSprintModal && (
        <NewSprintModal
          onClose={() => setShowNewSprintModal(false)}
          currentSprints={sprints}
        />
      )}

      <button
        className="flex rounded-xl bg-gray-800 p-2.5 text-sm text-white shadow-lg"
        onClick={() => setShowNewSprintModal(true)}
      >
        New Sprint
      </button>
    </>
  );
}
