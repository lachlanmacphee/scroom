import React, { useState } from "react";
import { ImBin } from "react-icons/im";

type DeleteCriteria = (criteria: string) => void;

export default function CriteriaItem({
  criteria,
  deleteCriteria,
}: {
  criteria: string;
  deleteCriteria: DeleteCriteria;
}) {
  const [mouseIsOver, setMouseIsOver] = useState(false);

  return (
    <div
      className="flex w-full border-b border-gray-200 px-4 py-2 dark:border-gray-600"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {criteria}
      </p>

      {mouseIsOver && (
        <button
          onClick={() => {
            deleteCriteria(criteria);
          }}
        >
          <ImBin fontSize="1em" />
        </button>
      )}
    </div>
  );
}
