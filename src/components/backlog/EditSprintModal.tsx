import React, { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import type { Sprint } from "@prisma/client";
import Modal from "../common/Modal";
import { api } from "~/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import {
  type EditSprintSchema,
  editSprintSchema,
  type onClose,
} from "~/utils/types";
import { sprintExists } from "~/utils/funcs";

export default function EditSprintModal({
  currentSprints,
  onClose,
}: {
  currentSprints: Sprint[];
  onClose: onClose;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const updateMutation = api.sprint.update.useMutation();
  const { data: session } = useSession();
  const teamId = session?.user.teamId;

  const { register, handleSubmit } = useForm<EditSprintSchema>({
    resolver: zodResolver(editSprintSchema),
  });

  if (!teamId) {
    return null;
  }

  const endSubmit = async () => {
    onClose();
    await router.replace(router.asPath);
  };

  const onSubmit = (data: EditSprintSchema) => {
    if (!sprintExists(currentSprints, data)) {
      updateMutation.mutate({ ...data, teamId }, { onSuccess: endSubmit });
      setError("");
    } else {
      setError("Sprint already exists in these times");
    }
  };

  return (
    <Modal title="Edit Sprint" onClose={onClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4"
        id="upsert-issue-form"
      >
        <p>{error}</p>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between gap-2">
            <label className="font-bold dark:text-white">Select Sprint</label>
            <select
              data-testid="editSprintId"
              className="w-3/4 rounded-md border border-gray-900 text-gray-900"
              {...register("id", { required: true })}
            >
              {currentSprints.map((sprint) => (
                <option key={sprint.id} value={sprint.id}>
                  {sprint.name}
                </option>
              ))}
            </select>
            <label className="font-bold dark:text-white">Sprint Rename</label>
            <input
              className="w-3/4 rounded-md border border-gray-900 pl-1 text-gray-900"
              data-testid="editSprintName"
              {...register("name", { required: true })}
            />
            <label className="font-bold dark:text-white">Start Date</label>
            <input
              type="date"
              className="w-3/4 rounded-md border border-gray-900 pl-1 text-gray-900"
              data-testid="editStartDate"
              {...register("startDate", { required: true })}
            />
            <label className="font-bold dark:text-white">End Date</label>
            <input
              type="date"
              className="w-3/4 rounded-md border border-gray-900 pl-1 text-gray-900"
              data-testid="editEndDate"
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
              Update
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
