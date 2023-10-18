/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { useState } from "react";
import { ImBin } from "react-icons/im";
import { User, type IssueComment } from "@prisma/client";
import { type DeleteComment } from "~/utils/types";
import { useSession } from "next-auth/react";

export default function CommentItem({
  comment,
  deleteComment,
  teamUsers,
}: {
  comment: IssueComment;
  deleteComment: DeleteComment;
  teamUsers: User[];
}) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const { data: session } = useSession();

  function getUserById(idToFind: string): string | null | undefined {
    const user = teamUsers.find((user) => user.id === idToFind);
    if (user) {
      return user.name;
    } else return "no one";
  }

  return (
    <div
      className="flex w-full border-b border-gray-200 px-4 py-2 dark:border-gray-600"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      <div className="my-auto flex h-[90%] w-full flex-auto overflow-x-hidden whitespace-pre-wrap">
        <p className="flex-auto">- {comment.content}</p>
        <p className="px-2 opacity-50">
          commented by{" "}
          {teamUsers.find((user) => user.id === comment.userId)?.name ?? "no"}{" "}
          on {comment.dateCreated.toDateString()}
        </p>
      </div>

      {mouseIsOver && session?.user?.id === comment.userId && (
        <button
          type="button"
          onClick={() => {
            deleteComment(comment.id);
          }}
        >
          <ImBin fontSize="1em" />
        </button>
      )}
    </div>
  );
}
