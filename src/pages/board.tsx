import React from "react";
import { type GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";
import type { Issue, Team } from "@prisma/client";
import IssueContainer from "~/components/board/IssueContainer";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { columns } from "~/utils/constants";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";

export default function ScrumBoard({
  issues,
  team,
}: {
  issues: Issue[];
  team: Team;
}) {
  const updateMutation = api.issue.update.useMutation();
  const { data: session } = useSession();

  const updateIssue = (id: string, status: string) => {
    const teamId = session?.user.teamId;
    if (!teamId) return;
    updateMutation.mutate({ id, status, teamId });
  };

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeIssue = issues.find(
      (issue) => issue.id === active.id.toString(),
    );

    if (activeIssue) {
      activeIssue.status = over.id.toString();
      updateIssue(active.id.toString(), over.id.toString());
    }
  }

  return (
    <div className="flex flex-grow flex-col bg-white dark:bg-slate-700">
      <div className="py-4 text-center">
        <h1 className="text-3xl font-bold dark:text-white">Scrum Board</h1>
        <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
          {team.projectName}
        </h2>
      </div>
      <DndContext onDragEnd={onDragEnd}>
        <div className="flex flex-col gap-4 p-4 md:flex-row">
          {columns.map((col) => (
            <IssueContainer
              key={col.id}
              containerId={col.id}
              containerTitle={col.title}
              issues={issues.filter((issue) => issue.status === col.id)}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
      },
    };
  }

  if (!session.user?.teamId) {
    return;
  }

  const issues = await prisma.issue.findMany({
    select: {
      id: true,
      summary: true,
      status: true,
      estimate: true,
      backlog: true,
    },
    where: {
      backlog: "sprint",
      teamId: session.user.teamId,
    },
    orderBy: {
      estimate: { sort: "desc", nulls: "last" },
    },
  });

  const team = await prisma.team.findUnique({
    select: {
      projectName: true,
    },
    where: {
      id: session.user.teamId,
    },
  });

  return {
    props: { issues, team },
  };
}
