import React from "react";
import CommentItem from "./CommentItem";
import type { IssueComment, User } from "@prisma/client";
import { type DeleteComment } from "~/utils/types";

export default function CommentList({
  comments,
  deleteCommentHandler,
  teamUsers,
}: {
  comments: IssueComment[];
  deleteCommentHandler: DeleteComment;
  teamUsers: User[];
}) {
  return (
    <div className="flex max-h-[200px] flex-grow flex-col overflow-y-auto rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          deleteComment={deleteCommentHandler}
          teamUsers={teamUsers}
        />
      ))}
    </div>
  );
}
