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
import InputGroup from "~/components/common/InputGroup";

export default function TeamDetailsButton({ team }: { team: Team }) {
  const [isTeamDetailsModalOpen, setIsTeamDetailsModalOpen] = useState(false);
  const updateMutation = api.team.update.useMutation();
  const router = useRouter();

  const { register, handleSubmit } = useForm<TeamDetailsFormSchema>({
    resolver: zodResolver(teamDetailsFormSchema),
  });

  const onSubmit = async (data: TeamDetailsFormSchema) => {
    updateMutation.mutate({ ...data, id: team.id });
    setIsTeamDetailsModalOpen(false);
    await router.replace(router.asPath);
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
            <InputGroup
              htmlFor="name"
              label="Team Name"
              name="name"
              {...(register("name"),
              {
                required: true,
                minLength: 3,
                defaultValue: team.name,
              })}
              data-testid="teamNameField"
            />
            <InputGroup
              htmlFor="projectName"
              label="Project Name"
              {...(register("projectName"),
              {
                required: true,
                minLength: 3,
                defaultValue: team.projectName,
              })}
              data-testid="projectNameField"
            />
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
