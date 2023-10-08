import React from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { type Issue, type User } from "@prisma/client";
import Modal from "../common/Modal";
import { api } from "~/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type onClose,
  issueFormSchema,
  type IssueFormSchema,
} from "~/utils/types";

export default function UpsertIssueModal({
  onClose,
  issue,
  teamId,
  backlog,
  teamUsers,
}: {
  onClose: onClose;
  issue?: Issue;
  teamId?: string;
  backlog?: string;
  teamUsers: User[];
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const createMutation = api.issue.create.useMutation();
  const updateMutation = api.issue.update.useMutation();

  const { register, handleSubmit } = useForm<IssueFormSchema>({
    resolver: zodResolver(issueFormSchema),
    defaultValues: {
      summary: issue?.summary ?? "",
      status: issue?.status ?? "toDo",
      backlog: issue?.backlog ?? backlog,
      assignee: issue?.userId ?? "",
      type: issue?.type ?? "task",
      estimate: issue?.estimate?.toString() ?? "0",
    },
  });

  const onSubmit = async (data: IssueFormSchema) => {
    if (!issue && teamId) {
      createMutation.mutate({
        teamId,
        status: data.status,
        summary: data.summary,
        backlog: data.backlog,
      });
    } else if (issue?.id && teamId) {
      updateMutation.mutate({
        id: issue.id,
        status: data.status,
        summary: data.summary,
        backlog: data.backlog,
        teamId,
      });
    }
    onClose();
    await router.replace(router.asPath);
  };

  return (
    <Modal title={issue ? "Edit Issue" : "Create Issue"} onClose={onClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4"
      >
        <div className="flex flex-col gap-2">
          <div className="flex justify-between gap-2">
            <label className="font-bold dark:text-white">Summary</label>
            <input
              className="w-3/4 rounded-md border border-gray-900 pl-1"
              data-testid="summary"
              {...register("summary", { required: true })}
            />
          </div>
          {backlog === "sprint" && (
            <div className="flex justify-between gap-2">
              <label className="font-bold dark:text-white">Status</label>
              <select
                id="status"
                data-testid="status"
                className="w-3/4 rounded-md border border-gray-900"
                {...register("status")}
              >
                <option value="toDo">To Do</option>
                <option value="inProgress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          )}
          {session?.user.role === "productOwner" && (
            <div className="flex justify-between gap-2">
              <label className="font-bold dark:text-white">Backlog</label>
              <select
                id="backlog"
                data-testid="backlog"
                className="w-3/4 rounded-md border border-gray-900"
                {...register("backlog")}
              >
                <option value="sprint">Sprint Backlog</option>
                <option value="product">Product Backlog</option>
              </select>
            </div>
          )}
          <div className="flex justify-between gap-2">
            <label className="font-bold dark:text-white">Assignee</label>
            <select
              id="assignee"
              data-testid="assignee"
              className="w-3/4 rounded-md border border-gray-900"
              {...register("assignee")}
            >
              <option value="">Unassigned</option>
              {teamUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-between gap-2">
            <label className="font-bold dark:text-white">Type</label>
            <select
              id="type"
              data-testid="type"
              className="w-3/4 rounded-md border border-gray-900"
              {...register("type")}
            >
              <option value="task">Task</option>
              <option value="story">Story</option>
              <option value="bug">Bug</option>
            </select>
          </div>
          <div className="flex justify-between gap-2">
            <label className="font-bold dark:text-white">Estimate</label>
            <input
              type="number"
              data-testid="estimate"
              className="w-3/4 rounded-md border border-gray-900 pl-1"
              {...register("estimate", { min: "0" })}
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
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}
