import { type Team } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HiOutlinePencil } from "react-icons/hi";
import {
  type TeamDetailsFormSchema,
  teamDetailsFormSchema,
} from "~/utils/types";
import Modal from "~/components/common/Modal";

export default function TeamDetailsButton({ team }: { team: Team }) {
  const [isTeamDetailsModalOpen, setIsTeamDetailsModalOpen] = useState(false);
  const updateMutation = api.team.update.useMutation();
  const router = useRouter();

  const { register, handleSubmit } = useForm<TeamDetailsFormSchema>({
    resolver: zodResolver(teamDetailsFormSchema),
    defaultValues: {
      name: team.name,
      projectName: team.projectName,
    },
  });

  const onSubmit = (data: TeamDetailsFormSchema) => {
    updateMutation.mutate(
      { ...data, id: team.id },
      {
        onSuccess: async () => {
          setIsTeamDetailsModalOpen(false);
          await router.replace(router.asPath);
        },
      },
    );
  };

  return (
    <>
      <button
        data-testid="editTeamDetailsButton"
        onClick={() => setIsTeamDetailsModalOpen(true)}
      >
        <HiOutlinePencil size="1.75em" className="dark:stroke-white" />
      </button>
      {isTeamDetailsModalOpen && (
        <Modal
          onClose={() => setIsTeamDetailsModalOpen(false)}
          title="Change Team Details"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 p-4"
          >
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Team Name
              </label>
              <input
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                data-testid="teamNameField"
                {...register("name", {
                  required: true,
                  minLength: 3,
                })}
              />
            </div>
            <div>
              <label
                htmlFor="projectName"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Project Name
              </label>
              <input
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                data-testid="projectNameField"
                {...register("projectName", {
                  required: true,
                  minLength: 3,
                })}
              />
            </div>
            <div className="flex items-center justify-end space-x-2">
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
