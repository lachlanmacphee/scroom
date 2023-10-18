import {
  type onClose,
  dailyScrumFormSchema,
  type DailyScrumFormSchema,
} from "~/utils/types";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import Modal from "../common/Modal";
import type { DailyScrum, User } from "@prisma/client";
import { useForm } from "react-hook-form";

export default function AddDailyScrumModal({
  onClose,
  user,
  dailyScrum,
}: {
  onClose: onClose;
  user: User;
  dailyScrum?: DailyScrum;
}) {
  const createMutation = api.dailyScrum.create.useMutation();
  const updateMutation = api.dailyScrum.update.useMutation();

  const teamId = user.teamId;
  const userId = user.id;
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  const datePosted = date.toISOString();

  const { register, handleSubmit } = useForm<DailyScrumFormSchema>({
    resolver: zodResolver(dailyScrumFormSchema),
    defaultValues: {
      yesterday: dailyScrum?.yesterday ?? "",
      today: dailyScrum?.today ?? "",
      blockers: dailyScrum?.blockers ?? "",
    },
  });

  const onSubmit = (data: DailyScrumFormSchema) => {
    if (!dailyScrum && teamId) {
      createMutation.mutate(
        { ...data, datePosted, userId, teamId },
        { onSuccess: endSubmit },
      );
    } else if (dailyScrum?.id && teamId) {
      updateMutation.mutate(
        { ...data, datePosted, userId, id: dailyScrum.id, teamId },
        { onSuccess: endSubmit },
      );
    }
  };

  const { refetch } = api.dailyScrum.get.useQuery({
    datePosted: datePosted,
    teamId: teamId ?? "",
  });

  const endSubmit = async () => {
    onClose();
    await refetch();
  };

  return (
    <Modal title="Add Today's Daily Scrum" onClose={onClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4"
        id="upsert-daily-scrum-form"
      >
        <div className="mb-6 grid gap-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Yesterday:
            </label>
            <input
              type="text"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
              {...register("yesterday", { required: true })}
              data-testid="yesterday"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Today:
            </label>
            <input
              type="text"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
              {...register("today", { required: true })}
              data-testid="today"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Blockers:
            </label>
            <input
              type="text"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
              {...register("blockers", { required: true })}
              data-testid="blockers"
              required
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
            data-testid="submit-daily-scrum"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}
