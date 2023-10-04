/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { type FormEvent } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { type Issue, type User } from "@prisma/client";
import Modal from "../common/Modal";

type onClose = () => void;

export default function UpsertIssueModal({
  onClose,
  issue,
  teamId,
  backlog,
  teamUsers,
}: {
  onClose: onClose;
  issue?: Issue;
  teamId?: string;
  backlog?: string;
  teamUsers: User[];
}) {
  const { data: session } = useSession();
  const router = useRouter();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (!issue && teamId) {
      await fetch(`/api/issues/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(formData), teamId }),
      });
    } else if (issue?.id) {
      await fetch(`/api/issues/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(formData),
          issueID: issue.id,
        }),
      });
    }
    onClose();
    await router.replace(router.asPath);
  };

  return (
    <Modal title={issue ? "Edit Issue" : "Create Issue"} onClose={onClose}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between gap-2">
            <label className="font-bold dark:text-white">Summary</label>
            <input
              className="w-3/4 rounded-md border border-gray-900 pl-1"
              type="text"
              name="summary"
              data-testid="summary"
              defaultValue={issue?.summary ?? ""}
              required
            />
          </div>
          {backlog === "sprint" && (
            <div className="flex justify-between gap-2">
              <label className="font-bold dark:text-white">Status</label>
              <select
                name="status"
                id="status"
                data-testid="status"
                defaultValue={issue?.status ?? "toDo"}
                className="w-3/4 rounded-md border border-gray-900"
              >
                <option value="toDo">To Do</option>
                <option value="inProgress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          )}
          {session?.user.role === "productOwner" && (
            <div className="flex justify-between gap-2">
              <label className="font-bold dark:text-white">Backlog</label>
              <select
                name="backlog"
                id="backlog"
                data-testid="backlog"
                className="w-3/4 rounded-md border border-gray-900"
                defaultValue={issue?.backlog ?? backlog}
              >
                <option value="sprint">Sprint Backlog</option>
                <option value="product">Product Backlog</option>
              </select>
            </div>
          )}
          <div className="flex justify-between gap-2">
            <label className="font-bold dark:text-white">Assignee</label>
            <select
              name="userId"
              id="assignee"
              data-testid="assignee"
              defaultValue={issue?.userId ?? ""}
              className="w-3/4 rounded-md border border-gray-900"
            >
              <option value="">Unassigned</option>
              {teamUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-between gap-2">
            <label className="font-bold dark:text-white">Type</label>
            <select
              name="type"
              id="type"
              data-testid="type"
              defaultValue={issue?.type ?? "task"}
              className="w-3/4 rounded-md border border-gray-900"
            >
              <option value="task">Task</option>
              <option value="story">Story</option>
              <option value="Bug">Bug</option>
            </select>
          </div>
          <div className="flex justify-between gap-2">
            <label className="font-bold dark:text-white">Estimate</label>
            <input
              name="estimate"
              type="number"
              data-testid="estimate"
              min="0"
              className="w-3/4 rounded-md border border-gray-900 pl-1"
              defaultValue={issue?.estimate ?? "0"}
            />
          </div>
        </div>
        <div className="flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}
