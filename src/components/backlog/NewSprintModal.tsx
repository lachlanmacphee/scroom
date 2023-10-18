import React, { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import type { Sprint } from "@prisma/client";
import Modal from "../common/Modal";
import { api } from "~/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import {
  type NewSprintSchema,
  newSprintSchema,
  type onClose,
} from "~/utils/types";
import { sprintExists } from "~/utils/funcs";

export default function NewSprintModal({
  currentSprints,
  onClose,
}: {
  currentSprints: Sprint[];
  onClose: onClose;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const createMutation = api.sprint.create.useMutation();
  const { data: session } = useSession();
  const teamId = session?.user.teamId;

  const { register, handleSubmit } = useForm<NewSprintSchema>({
    resolver: zodResolver(newSprintSchema),
  });

  if (!teamId) {
    return null;
  }

  const endSubmit = async () => {
    onClose();
    await router.replace(router.asPath);
  };

  const onSubmit = (data: NewSprintSchema) => {
    if (!sprintExists(currentSprints, data)) {
      createMutation.mutate({ ...data, teamId }, { onSuccess: endSubmit });
      setError("");
    } else {
      setError("Sprint already exists in these times");
    }
  };

  return (
    <Modal title={"Create new sprint"} onClose={onClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4"
        id="new-sprint-form"
      >
        <p>{error}</p>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between gap-2">
            <label className="font-bold dark:text-white">Sprint name</label>
            <input
              className="w-3/4 rounded-md border border-gray-900 pl-1 text-gray-900"
              data-testid="newSprintName"
              {...register("name", { required: true })}
            />
            <label className="font-bold dark:text-white">Start Date</label>
            <input
              type="date"
              className="w-3/4 rounded-md border border-gray-900 pl-1 text-gray-900"
              data-testid="NewStartDate"
              {...register("startDate", { required: true })}
            />
            <label className="font-bold dark:text-white">End Date</label>
            <input
              type="date"
              className="w-3/4 rounded-md border border-gray-900 pl-1 text-gray-900"
              data-testid="NewEndDate"
              {...register("endDate", { required: true })}
            />
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
              Create
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
