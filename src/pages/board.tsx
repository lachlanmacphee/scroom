import React from "react";
import { type GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import type { Issue, Team } from "@prisma/client";
import { prisma } from "~/server/db";
import IssueComp from "~/components/backlog/IssueComp";

export default function ScrumBoard({
  issues,
  team,
}: {
  issues: Issue[];
  team: Team;
}) {
  const todoIssues = issues?.filter((issue) => issue.status === "toDo");
  const inProgressIssues = issues?.filter(
    (issue) => issue.status === "inProgress",
  );
  const doneIssues = issues?.filter((issue) => issue.status === "done");

  return (
    <>
      <div className="py-4 text-center">
        <h1 className="text-3xl font-bold">Scrum Board</h1>
        <h2 className="text-lg font-semibold text-gray-600">
          {team.projectName}, Sprint 0
        </h2>
      </div>
      <div className="flex justify-center gap-4 px-4">
        <IssueComp issues={todoIssues} status="TO DO" />
        <IssueComp issues={inProgressIssues} status="IN PROGRESS" />
        <IssueComp issues={doneIssues} status="DONE" />
      </div>
    </>
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

  const issues = await prisma.issue.findMany({
    select: {
      summary: true,
      status: true,
    },
    where: {
      backlog: "sprint",
    },
  });

  if (!session.user?.teamId) {
    return {
      redirect: {
        destination: "/onboarding",
      },
    };
  }

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
