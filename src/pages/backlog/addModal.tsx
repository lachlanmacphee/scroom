/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState } from "react";
import { useRouter } from "next/router";

type onClose = () => void;

interface props {
  show: boolean;
  onClose: onClose;
  teamId: string;
}

const Modal = (props: props) => {
  const [summary, setSummary] = useState("");
  const [status, setStatus] = useState("toDo");
  const [backlog, setBacklog] = useState("product");
  const teamId: string = props.teamId;

  const router = useRouter();

  const refreshData = async () => {
    await router.replace(router.asPath);
  };
  const createNewIssues = async () => {
    try {
      const body = { summary, status, backlog, teamId };

      await fetch(`/api/createIssue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      props.onClose();
      await refreshData();
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => {
    props.onClose()
    setSummary("")
    setStatus("toDo")
    setBacklog("")

  }


  if (!props.show) {
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
            <form onSubmit={() => createNewIssues()}>
              <div className="bg-white px-5 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3
                      className="text-xl font-semibold text-gray-900"
                      id="modal-title"
                    >
                      Create New Issue
                    </h3>
                    <div className="mt-4 flex">
                      <label>Summary:</label>
                      <input
                        className="ml-2 w-full rounded-md border border-gray-900"
                        type="text"
                        name="Task"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                      />
                    </div>
                    <div className="mt-4 flex">
                      <label>Status:</label>
                      <select
                        name="status"
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="toDo">To Do</option>
                        <option value="inProgress">In Progress</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                    <div className="mt-4 flex">
                      <label>Backlog:</label>
                      <select
                        name="backlog"
                        id="backlog"
                        value={backlog}
                        onChange={(e) => setBacklog(e.target.value)}
                      >
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
                  onClick={() => closeModal()}
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

export default Modal;
