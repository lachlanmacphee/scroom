/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import React from "react";
import type { Issue } from "@prisma/client";
import { prisma } from "~/server/db";
import BacklogSection from "~/components/backlog/BacklogSection";

export default function Backlog({
  sprintIssues,
  productIssues,
}: {
  sprintIssues: Issue[];
  productIssues: Issue[];
}) {
  return (
    <div className="flex flex-grow flex-col bg-white dark:bg-slate-700">
      <BacklogSection issues={sprintIssues} backlog="sprint" />
      <BacklogSection issues={productIssues} backlog="product" />
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
    },
    where: {
      teamId: session.user.teamId,
      backlog: "product",
    },
    orderBy: {
      summary: "asc",
    },
  });

  return {
    props: {
      sprintIssues,
      productIssues,
    },
  };
}
