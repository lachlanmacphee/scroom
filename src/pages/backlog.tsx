import { type GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import React from "react";
import { prisma } from "~/server/db";
import BacklogSection from "~/components/backlog/BacklogSection";
import type { Issue, User } from "@prisma/client";

export default function Backlog({
  sprintIssues,
  productIssues,
  teamUsers,
}: {
  sprintIssues: Issue[];
  productIssues: Issue[];
  teamUsers: User[];
}) {
  return (
    <div className="flex flex-grow flex-col bg-white dark:bg-slate-700">
      <BacklogSection
        issues={sprintIssues}
        backlog="sprint"
        teamUsers={teamUsers}
      />
      <BacklogSection
        issues={productIssues}
        backlog="product"
        teamUsers={teamUsers}
      />
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

  const sprintIssues = await prisma.issue.findMany({
    select: {
      id: true,
      status: true,
      backlog: true,
      summary: true,
      teamId: true,
      estimate: true,
      type: true,
      userId: true,
    },
    where: {
      teamId: session.user.teamId,
      backlog: "sprint",
    },
    orderBy: {
      summary: "asc",
    },
  });

  const productIssues = await prisma.issue.findMany({
    select: {
      id: true,
      status: true,
      backlog: true,
      summary: true,
      teamId: true,
      estimate: true,
      type: true,
      userId: true,
    },
    where: {
      teamId: session.user.teamId,
      backlog: "product",
    },
    orderBy: {
      summary: "asc",
    },
  });

  const teamUsers = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      teamId: true,
      role: true,
    },
    where: {
      teamId: session.user?.teamId,
    },
  });

  return {
    props: {
      sprintIssues,
      productIssues,
      teamUsers,
    },
  };
}
