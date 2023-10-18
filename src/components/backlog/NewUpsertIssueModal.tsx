/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, {
  useEffect,
  useState,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { type Issue, type User } from "@prisma/client";
import Modal from "../common/Modal";
import { api } from "~/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type onClose,
  issueFormSchema,
  type IssueFormSchema,
  type voidReturnFunc,
} from "~/utils/types";
import { useTour } from "@reactour/tour";
import CommentList from "./CommentList";
import type { IssueComment, Sprint, Status } from "@prisma/client";
import { useSession } from "next-auth/react";

export default function NewUpsertIssueModal({
  onClose,
  issue,
  backlog,
  teamUsers,
  currentUserId,
  sprint,
  statuses,
}: {
  onClose: onClose;
  issue?: Issue;
  backlog?: string;
  teamUsers: User[];
  currentUserId?: string;
  sprint?: Sprint;
  statuses: Status[];
}) {
  const router = useRouter();
  const { setCurrentStep, isOpen } = useTour();
  const createMutation = api.issue.create.useMutation();
  const updateMutation = api.issue.update.useMutation();
  const createCommentMutation = api.issueComment.create.useMutation();
  const deleteCommentMutation = api.issueComment.delete.useMutation();
  const [currentNewComment, setCurrentNewComment] = useState("");
  const { data: session } = useSession();

  const { register, handleSubmit } = useForm<IssueFormSchema>({
    resolver: zodResolver(issueFormSchema),
    defaultValues: {
      summary: issue?.summary ?? "",
      status: issue?.status ?? "toDo",
      backlog: issue?.backlog ?? backlog,
      userId: issue?.userId ?? "",
      type: issue?.type ?? "task",
      estimate: issue?.estimate ?? "0",
      description: issue?.description ?? "",
    },
  });

  let issueComments: IssueComment[] = [];
  let refetchComments: voidReturnFunc;
  if (issue) {
    const { data, refetch } = api.issueComment.get.useQuery({
      issueId: issue.id,
    });
    refetchComments = refetch;
    if (data) {
      issueComments = data;
    }
  }

  const endSubmit = async () => {
    onClose();
    isOpen && setCurrentStep(10);
    await router.replace(router.asPath);
  };

  const onSubmit = (data: IssueFormSchema) => {
    if (!sprint) {
      return;
    }
    if (!issue && session?.user.teamId) {
      createMutation.mutate(
        {
          ...data,
          teamId: session?.user.teamId,
          sprintId: data.backlog === "sprint" ? sprint?.id : null,
        },
        { onSuccess: endSubmit },
      );
    } else if (issue?.id && session?.user.teamId) {
      updateMutation.mutate(
        {
          ...data,
          id: issue.id,
          teamId: session?.user.teamId,
          sprintId: data.backlog === "sprint" ? sprint?.id : null,
        },
        { onSuccess: endSubmit },
      );
    }
  };

  const deleteCommentHandler = (commentId: string) => {
    deleteCommentMutation.mutate(
      { id: commentId },
      { onSuccess: refetchComments },
    );
  };

  useEffect(() => {
    isOpen && setCurrentStep(9);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createCommentHandler = () => {
    if (currentNewComment.trim() === "") {
      return;
    }

    const now = new Date();
    const isoDateString = now.toISOString();

    if (currentUserId && issue?.id) {
      createCommentMutation.mutate(
        {
          userId: currentUserId,
          dateCreated: isoDateString,
          content: currentNewComment,
          issueId: issue?.id,
        },
        { onSuccess: refetchComments },
      );
    }
    setCurrentNewComment("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // function to unfocus on an input field when enter is pressed

    if (e.key === "Enter") {
      e.preventDefault();
      const inputElements = document.querySelectorAll("input");

      // Loop through each input element and call blur()
      inputElements.forEach((inputElement) => {
        inputElement.blur();
      });
    }
  };

  const handleCommentChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentNewComment(event.target.value);
  };

  return (
    <Modal title={issue ? "Edit Issue" : "Create Issue"} onClose={onClose}>
      <form
        className="px-4 py-4"
        onSubmit={handleSubmit(onSubmit)}
        id="upsert-issue-form"
      >
        <div className="mb-6">
          <label
            htmlFor="summary"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Summary
          </label>
          <input
            data-testid="summary"
            onKeyDown={handleKeyDown}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            {...register("summary", { required: true })}
            required
          />
        </div>
        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <div className="mb-1">
            <label
              htmlFor="backlog"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Backlog
            </label>
            <select
              id="backlog"
              data-testid="backlog"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              {...register("backlog")}
            >
              <option value="sprint">{sprint?.name} Backlog</option>
              <option value="product">Product Backlog</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="userId"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Assignee
            </label>
            <select
              id="userId"
              data-testid="userId"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
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
        </div>
        <div className="mb-6 grid gap-6 md:grid-cols-3">
          <div>
            <label
              htmlFor="type"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Type
            </label>
            <select
              id="type"
              data-testid="type"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              {...register("type")}
            >
              <option value="task">Task</option>
              <option value="story">Story</option>
              <option value="bug">Bug</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="estimate"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Estimate
            </label>
            <input
              data-testid="estimate"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              pattern="[0-9]|10"
              placeholder="1-10"
              onKeyDown={handleKeyDown}
              {...register("estimate", { min: "0" })}
            />
          </div>
          {backlog === "sprint" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                Status
              </label>
              <select
                id="status"
                data-testid="status"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
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
        </div>
        <div className="mb-6">
          <label
            htmlFor="large-input"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Description
          </label>
          <input
            id="description"
            data-testid="description"
            type="text"
            {...register("description")}
            className="sm:text-md block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }

              if (e.key === "Enter" && e.shiftKey) {
                e.preventDefault();
                const inputElements = document.querySelectorAll("input");

                // Loop through each input element and call blur()
                inputElements.forEach((inputElement) => {
                  inputElement.blur();
                });
              }
            }}
          />
        </div>

        {issue && (
          <div className="mb-6">
            <div className="mb-2 flex text-sm font-medium text-gray-900 dark:text-white">
              <p className="flex-auto">Comments</p>
              <button
                type="button"
                onClick={createCommentHandler}
                className=" rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Add
              </button>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"></div>
              <input
                type="text"
                id="commentInput"
                onKeyDown={handleKeyDown}
                className="mb-4 block w-full rounded-lg border  border-gray-300 bg-gray-50 p-4 pl-5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="Add New Comment"
                value={currentNewComment}
                onChange={handleCommentChange}
              />
            </div>
            <CommentList
              deleteCommentHandler={deleteCommentHandler}
              comments={issueComments}
              teamUsers={teamUsers}
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
        >
          Submit
        </button>
      </form>
    </Modal>
  );
}
