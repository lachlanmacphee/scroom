/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { type FormEvent } from "react";
import { useRouter } from "next/router";
import { type Issue } from "@prisma/client";

type onClose = () => void;

export default function UpsertModal({
  show,
  onClose,
  issue,
  teamId,
}: {
  show: boolean;
  onClose: onClose;
  issue?: Issue;
  teamId?: string;
}) {
  const router = useRouter();

  const refreshData = async () => {
    await router.replace(router.asPath);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (!issue && teamId) {
      await fetch(`/api/createIssue`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(formData), teamId }),
      });
    } else if (issue?.id) {
      await fetch(`/api/updateIssue`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(formData),
          issueID: issue.id,
        }),
      });
    }
    onClose();
    await refreshData();
  };

  if (!show) {
    return null;
  }

  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <form onSubmit={onSubmit} className="flex flex-col gap-2 p-4">
              <h3
                className="text-xl font-semibold text-gray-900"
                id="modal-title"
              >
                {issue ? "Edit Issue" : "Create Issue"}
              </h3>
              <div className="flex justify-between gap-2">
                <label className="font-bold">Summary</label>
                <input
                  className="w-3/4 rounded-md border border-gray-900"
                  type="text"
                  name="summary"
                  defaultValue={issue?.summary ?? ""}
                  required
                />
              </div>
              <div className="flex justify-between gap-2">
                <label className="font-bold">Status</label>
                <select
                  name="status"
                  id="status"
                  defaultValue={issue?.status ?? "toDo"}
                  className="w-3/4 rounded-md border border-gray-900"
                >
                  <option value="toDo">To Do</option>
                  <option value="inProgress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div className="flex justify-between gap-2">
                <label className="font-bold">Backlog</label>
                <select
                  name="backlog"
                  id="backlog"
                  className="w-3/4 rounded-md border border-gray-900"
                  defaultValue={issue?.backlog ?? "product"}
                >
                  <option value="sprint">Sprint Backlog</option>
                  <option value="product">Product Backlog</option>
                </select>
              </div>
              <div className=" px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="submit"
                  className="inline-flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset sm:mt-0 sm:w-auto"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="mr-3 inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
