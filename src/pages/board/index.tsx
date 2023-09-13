import React from "react";
import { type GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import type { Issue, Team } from "@prisma/client";
import { prisma } from "~/server/db";
import IssueComp from "~/components/IssueComp";

export default function ScrumBoard({
  issue,
  team,
}: {
  issue: Issue[];
  team: Team;
}) {
  const todoIssues = issue.filter((issue) => issue.status === "toDo");
  const inProgressIssues = issue.filter(
    (issue) => issue.status === "inProgress",
  );
  const doneIssues = issue.filter((issue) => issue.status === "done");

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

  const issue = await prisma.issue.findMany({
    select: {
      summary: true,
      status: true,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });
  if (!user?.teamId) {
    return;
  }

  const team = await prisma.team.findUnique({
    select: {
      projectName: true,
    },
    where: {
      id: user.teamId,
    },
  });

  return {
    props: { issue, team },
  };
}
