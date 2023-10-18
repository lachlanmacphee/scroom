import React, { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import type { Sprint } from "@prisma/client";
import NewSprintModal from "./NewSprintModal";

export default function NewSprintButton({
  sprints,
}:{
  sprints: Sprint[],
}) {
  const [showNewSprintModal, setShowNewSprintModal] = useState(false);

  return (
    <>
      {showNewSprintModal && (
        <NewSprintModal onClose={() => setShowNewSprintModal(false)} currentSprints={sprints} />
      )}

      <button
        className="rounded-full bg-gray-800 p-2.5 shadow-lg text-white"
        onClick={() => setShowNewSprintModal(true)}
      >
        <AiOutlinePlus />
      </button>
    </>
  );
}
