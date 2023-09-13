/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { type FormEvent } from "react";
import { useRouter } from "next/router";
import { type Issue } from "@prisma/client";

type onClose = () => void;

const EditModal = ({
  show,
  onClose,
  issue,
}: {
  show: boolean;
  onClose: onClose;
  issue: Issue;
}) => {
  const router = useRouter();

  const refreshData = async () => {
    await router.replace(router.asPath);
  };

  const updateIssue = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      await fetch(`/api/updateIssue`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: formData,
      });
      onClose();
      await refreshData();
    } catch (error) {
      console.error(error);
    }
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
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <form onSubmit={updateIssue}>
              <div className="bg-white px-5 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3
                      className="text-xl font-semibold text-gray-900"
                      id="modal-title"
                    >
                      Edit Issue
                    </h3>
                    <div className="mt-4 flex">
                      <label>Summary:</label>
                      <input
                        className="ml-2 w-full rounded-md border border-gray-900"
                        type="text"
                        name="Task"
                        defaultValue={issue.summary}
                      />
                    </div>
                    <div className="mt-4 flex">
                      <label>Status:</label>
                      <select
                        name="status"
                        id="status"
                        defaultValue={issue.status ?? "toDo"}
                      >
                        <option value="toDo">To Do</option>
                        <option value="inProgress">In Progress</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                    <div className="mt-4 flex">
                      <label>Backlog:</label>
                      <select name="backlog" id="backlog">
                        <option value="sprint">Sprint Backlog</option>
                        <option value="product">Product Backlog</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="submit"
                  className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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
};

export default EditModal;
