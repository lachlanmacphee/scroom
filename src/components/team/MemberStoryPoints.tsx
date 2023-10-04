import React from "react";
import type { Points } from "~/utils/types";

export default function MemberStoryPoints({ points }: { points: Points }) {
  return (
    <div
      data-testid="memberStoryPoints"
      className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300"
    >
      <span>{`${points.donePoints}/${points.totalPoints}`}</span>
    </div>
  );
}
