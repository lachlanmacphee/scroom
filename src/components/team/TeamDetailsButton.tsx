import { useRouter } from "next/router";
import Modal from "../common/Modal";
import { type Team } from "@prisma/client";
import { HiOutlinePencil } from "react-icons/hi";
import { useState, type FormEvent } from "react";

export default function TeamDetailsButton({ team }: { team: Team }) {
  const router = useRouter();
  const [isTeamDetailsModalOpen, setIsTeamDetailsModalOpen] = useState(false);

  const refreshData = async () => {
    await router.replace(router.asPath);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await fetch(`/api/updateTeam`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...Object.fromEntries(formData), id: team.id }),
    });
    setIsTeamDetailsModalOpen(false);
    await refreshData();
  };

  return (
    <>
      <button
        data-testid="editTeamDetailsButton"
        onClick={() => setIsTeamDetailsModalOpen(true)}
      >
        <HiOutlinePencil size="1.75em" />
      </button>
      {isTeamDetailsModalOpen && (
        <Modal
          onClose={() => setIsTeamDetailsModalOpen(false)}
          title="Change Team Details"
        >
          <form onSubmit={onSubmit} className="flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-1">
              <label className="dark:text-white">Team Name</label>
              <input
                name="name"
                data-testid="teamNameField"
                defaultValue={team.name}
                className="pl-2"
                minLength={3}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="dark:text-white">Project Name</label>
              <input
                name="projectName"
                data-testid="projectNameField"
                defaultValue={team.projectName}
                className="pl-2"
                minLength={3}
                required
              />
            </div>
            <div className="flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsTeamDetailsModalOpen(false)}
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
      )}
    </>
  );
}
