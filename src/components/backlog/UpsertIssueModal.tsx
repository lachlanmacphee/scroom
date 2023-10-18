import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import type { Issue, User, Status, Sprint } from "@prisma/client";
import Modal from "../common/Modal";
import { api } from "~/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type onClose,
  issueFormSchema,
  type IssueFormSchema,
} from "~/utils/types";
import { useTour } from "@reactour/tour";
import { useSession } from "next-auth/react";

export default function UpsertIssueModal({
  onClose,
  issue,
  backlog,
  teamUsers,
  statuses,
  sprint,
}: {
  onClose: onClose;
  issue?: Issue;
  backlog?: string;
  teamUsers: User[];
  statuses: Status[];
  sprint?: Sprint;
}) {
  const router = useRouter();
  const { setCurrentStep, isOpen } = useTour();
  const { data: session } = useSession();
  const teamId = session?.user.teamId;
  const createMutation = api.issue.create.useMutation();
  const updateMutation = api.issue.update.useMutation();

  const { register, handleSubmit } = useForm<IssueFormSchema>({
    resolver: zodResolver(issueFormSchema),
    defaultValues: {
      summary: issue?.summary ?? "",
      status: issue?.status ?? "toDo",
      backlog: issue?.backlog ?? backlog,
      userId: issue?.userId ?? "",
      type: issue?.type ?? "task",
      estimate: issue?.estimate ?? "0",
    },
  });

  const endSubmit = async () => {
    onClose();
    isOpen && setCurrentStep(10);
    await router.replace(router.asPath);
  };

  const onSubmit = (data: IssueFormSchema) => {
    if (!issue && teamId ) {
      createMutation.mutate(
        {
          ...data,
          teamId,
          sprintId: data.backlog === "sprint" ? sprint?.id : null,
        },
        { onSuccess: endSubmit },
      );
    } else if (issue?.id && teamId) {
      updateMutation.mutate(
        {
          ...data,
          id: issue.id,
          teamId,
          sprintId: data.backlog === "sprint" ? sprint?.id : null,
        },
        { onSuccess: endSubmit },
      );
    }
  };

  useEffect(() => {
    isOpen && setCurrentStep(9);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal title={issue ? "Edit Issue" : "Create Issue"} onClose={onClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4"
        id="upsert-issue-form"
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
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.title}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="flex justify-between gap-2">
            <label className="font-bold dark:text-white">Backlog</label>
            <select
              id="backlog"
              data-testid="backlog"
              className="w-3/4 rounded-md border border-gray-900"
              {...register("backlog")}
            >
              <option value="sprint">{sprint?.name} Backlog</option>
              <option value="product">Product Backlog</option>
            </select>
          </div>
          <div className="flex justify-between gap-2">
            <label className="font-bold dark:text-white">Assignee</label>
            <select
              id="userId"
              data-testid="userId"
              className="w-3/4 rounded-md border border-gray-900"
              {...register("userId")}
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
              min={0}
              {...register("estimate")}
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
