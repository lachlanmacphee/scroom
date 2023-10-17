import React from "react";
import { useRouter } from "next/router";
import { type Issue} from "@prisma/client";
import Modal from "../common/Modal";
import { api } from "~/utils/api";
import {
  type onClose,
} from "~/utils/types";

export default function UpsertIssueModal({
  onClose,
  issue,
}: {
  onClose: onClose;
  issue: Issue;
}) {
    const router = useRouter();
    const deleteMutation = api.issue.delete.useMutation();
    
    const deleteHandler = () => {
        deleteMutation.mutate(
        { id: issue.id },
        {
            onSuccess: async () => {
            await router.replace(router.asPath);
            },
        },
        );
    };

  return (
    <Modal title={"Delete " + issue?.summary + "?"} onClose={onClose}>
        <div className="flex flex-col gap-4 p-4">
            <div>
                <h1 className=" dark:text-white">Warning: You&apos;re about to permanently delete this issue, its comments and attachments, and all of its data</h1>
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
                type="button"
                onClick={deleteHandler}
                className="rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-200 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
            >
                Delete
            </button>
            </div>
        </div>
    </Modal>
  );
}
