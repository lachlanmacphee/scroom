import React from "react";
import { useRouter } from "next/router";
import Modal from "../common/Modal";
import { type Status } from "@prisma/client";
import { api } from "~/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type onClose, statusSchema, type StatusSchema } from "~/utils/types";


export default function EditStatusNameModal({
  onClose,
  statuses,
  id,
}: {
  onClose: onClose;
  statuses: Status[];
  id: string;
}) {
  const router = useRouter();
  const updateMutation = api.status.update.useMutation();

  const { register, handleSubmit } = useForm<StatusSchema>({
    resolver: zodResolver(statusSchema),
  });

  const onSubmit = (data: StatusSchema) => {
    if (data.title) {
      updateMutation.mutate(
        { id, title: data.title },
        { onSuccess: endSubmit },
      );
    }
  };

  const endSubmit = async () => {
    onClose();
    await router.replace(router.asPath);
  };

  return (
    <Modal title="Edit Status Title" onClose={onClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4"
      >
        <label
          htmlFor="title"
          className="text-m mb-2 block p-2 font-medium text-gray-900 dark:text-white"
        >
          Enter new name for the status:
        </label>
        <div>
          <input
            type="text"
            id="title"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            defaultValue={statuses.find((status) => status.id === id)?.title}
            {...register("title", {
              required: true,
              minLength: 3,
            })}
          />
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            type="submit"
            className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Update
          </button>
        </div>
      </form>
    </Modal>
  );
}
