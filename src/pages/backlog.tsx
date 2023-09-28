/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import React, { useState } from "react";
import IssueItem from "~/components/backlog/IssueItem";
import UpsertModal from "~/components/backlog/UpsertIssueModal";
import type { Issue } from "@prisma/client";
import { prisma } from "~/server/db";

export default function Backlog({
  sprintIssues,
  productIssues,
  teamId,
  role,
}: {
  sprintIssues: Issue[];
  productIssues: Issue[];
  teamId: string;
  role: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <>
      {show && <UpsertModal onClose={() => setShow(false)} teamId={teamId} />}
      <div className="m-5 flex flex-row">
        <div className="flex-auto text-lg">Sprint Backlog</div>
        <div className="relative flex-auto">
          <button
            className="absolute right-2 top-0 rounded-full bg-gray-800 px-4 py-2  text-white shadow-lg"
            data-testid="addSprintIssueButton"
            onClick={() => setShow(true)}
          >
            +
          </button>
        </div>
      </div>
      <div className="page border border-solid border-blue-500 px-10 py-10">
        {sprintIssues
          .sort((a, b) => a.id.localeCompare(b.id))
          .map((issue) => (
            <IssueItem issue={issue} key={issue.id} role={role} />
          ))}
      </div>

      <div className="m-5 flex flex-row">
        <div className="flex-auto text-lg">Product Backlog</div>
        <div className="relative flex-auto">
          <button
            className="absolute right-2 top-0 rounded-full bg-gray-800 px-4 py-2  text-white shadow-lg"
            data-testid="addProductIssueButton"
            onClick={() => setShow(true)}
          >
            +
          </button>
        </div>
      </div>
      <div className="page border border-solid border-red-500 px-10 py-10">
        {productIssues
          .sort((a, b) => a.id.localeCompare(b.id))
          .map((issue) => (
            <IssueItem issue={issue} key={issue.id} role={role} />
          ))}
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
  });

  return {
    props: {
      sprintIssues,
      productIssues,
      teamId: session.user.teamId,
      role: session.user.role,
    },
  };
}
