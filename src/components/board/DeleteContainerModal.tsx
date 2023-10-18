/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React  from "react";
import { useRouter } from "next/router";
import Modal from "../common/Modal";
import { type Issue,  type Status } from "@prisma/client";
import { api } from "~/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  type onClose,
  issuePartialSchema,
  type IssuePartialSchema,
} from "~/utils/types";


export default function DeleteContainerModal({
  onClose,
  id,
  onDeleteContainer,
  issues,
  statuses
}: {
  onClose: onClose;
  id: string;
  onDeleteContainer: (id: string) => void;
  issues: Issue[];
  statuses: Status[]
}) {
  const router = useRouter();
  const updateMutation = api.issue.updateStatus.useMutation();

  const { register, handleSubmit } = useForm<IssuePartialSchema>({
    resolver: zodResolver(issuePartialSchema),
  });

  const onSubmit = async (data: IssuePartialSchema) => {
    const selectedStatus = data.status;
    const issueIdsToUpdate = issues
      .filter(
        (issue) =>
          issue.status === statuses.find((status) => status.id === id)?.value,
      )
      .map((issue) => issue.id);

    const mutationPromises = issueIdsToUpdate.map(async (issueId) => {
      return updateMutation.mutateAsync({
        id: issueId,
        status: selectedStatus,
      });
    });

    await Promise.all(mutationPromises);
    void endSubmit();
    
  };


  const endSubmit = async () => {
    onDeleteContainer(id);
    onClose();
    await router.replace(router.asPath);
  };

   const filteredStatuses = statuses.filter(
     (status) => status.id !== id,
   );

  
  return (
    <Modal title={"Delete Container"} onClose={onClose}>
      <div className="flex flex-col gap-4 p-4">
        <div className="text-m mb-2 block font-medium text-gray-900 dark:text-white">
          <p className="p-2">Are you sure you want to delete this status?</p>
        </div>

        <label
          htmlFor="status"
          className="text-m block p-2 font-medium text-gray-900 dark:text-white"
        >
          Select a status to move the issues:
        </label>
        <select
          id="status"
          className="block w-3/5 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 md:w-4/5"
          style={{ margin: "10px" }} // Adjust the margin value as needed
          {...register("status")}
        >
          {filteredStatuses.map((status) => (
            <option key={status.id} value={status.value}>
              {status.title}
            </option>
          ))}
        </select>

        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={handleSubmit(onSubmit)}
            className="rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
