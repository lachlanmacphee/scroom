import { type Issue } from "@prisma/client";
import React from "react";

type clickHandler = (status: string) => void;

function StatusDropDown({
  issue,
  clickHandler,
}: {
  issue: Issue;
  clickHandler: clickHandler;
}) {
  return (
    <select
      name="status"
      id="status"
      defaultValue={issue.status ?? "toDo"}
      onChange={(e) => clickHandler(e.target.value)}
    >
      <option value="toDo">To Do</option>
      <option value="inProgress">In Progress</option>
      <option value="done">Done</option>
    </select>
  );
}

export default StatusDropDown;
