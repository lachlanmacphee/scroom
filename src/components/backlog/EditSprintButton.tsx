import React, { useState } from "react";
import EditSprintModal from "./EditSprintModal";
import { HiOutlinePencil } from "react-icons/hi";
import type { Sprint } from "@prisma/client";

export default function EditSprintButton({
  sprints,
}:{
  sprints: Sprint[],
}) {
  const [showEdiSprintModal, setShowEditSprintModal] = useState(false);
  return (
    <>
    {showEdiSprintModal && (
        <EditSprintModal 
        currentSprints={sprints}
        onClose={() => setShowEditSprintModal(false)}
         />
      )}
      <button
        className="rounded-full bg-gray-800 p-2.5 shadow-lg text-white"
        onClick={() => setShowEditSprintModal(true)}
    > 
        <HiOutlinePencil />
      </button>
    </>
  );
}



