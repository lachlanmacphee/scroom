import React from "react";
import { type GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import type { Issue, Team } from "@prisma/client";
import { prisma } from "~/server/db";
import IssueComp from "~/components/board/IssueComp";

export default function ScrumBoard({
  issues,
  team,
}: {
  issues: Issue[];
  team: Team;
}) {
  const toDoIssues = issues?.filter((issue) => issue.status === "toDo");
  const inProgressIssues = issues?.filter(
    (issue) => issue.status === "inProgress",
  );
  const doneIssues = issues?.filter((issue) => issue.status === "done");

  return (
    <div className="flex flex-grow flex-col bg-white dark:bg-slate-700">
      <div className="py-4 text-center">
        <h1 className="text-3xl font-bold dark:text-white">Scrum Board</h1>
        <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
          {team.projectName}, Sprint 0
        </h2>
      </div>
      <div className="flex flex-col justify-center gap-4 px-4 md:flex-row">
        <IssueComp issues={toDoIssues} status="TO DO" />
        <IssueComp issues={inProgressIssues} status="IN PROGRESS" />
        <IssueComp issues={doneIssues} status="DONE" />
      </div>
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
    return {
      redirect: {
        destination: "/onboarding",
      },
    };
  }

  const issues = await prisma.issue.findMany({
    select: {
      summary: true,
      status: true,
    },
    where: {
      teamId: session.user.teamId,
      backlog: "sprint",
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
