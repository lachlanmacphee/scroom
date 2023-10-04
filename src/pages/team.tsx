import React from "react";
import { getSession } from "next-auth/react";
import { prisma } from "~/server/db";

import type { User, Team } from "@prisma/client";
import type { PointsDict } from "~/types";
import { type GetServerSidePropsContext } from "next";

import UserTable from "~/components/team/UserTable";
import ResetTeamButton from "~/components/team/ResetTeamButton";
import TeamDetailsButton from "~/components/team/TeamDetailsButton";
import LeaveTeamButton from "~/components/team/LeaveTeamButton";
import calculatePoints from "~/components/team/calculatePoints";

export default function Team({
  role,
  users,
  team,
  pointsDict,
}: {
  role: string;
  users: User[];
  team: Team;
  pointsDict: PointsDict;
}) {
  const isAdmin = role === "admin";
  return (
    <div className="flex flex-grow flex-col bg-white dark:bg-slate-700 ">
      <div className="mb-4 mt-6 flex items-center justify-center gap-3">
        <div className="text-center">
          <h1 className="text-4xl font-semibold tracking-wide dark:text-white">
            {team.name}
          </h1>
          <h2 className=" text-3xl tracking-wide dark:text-gray-400">
            {team.projectName}
          </h2>
        </div>
        {isAdmin && <TeamDetailsButton team={team} />}
        {isAdmin && <ResetTeamButton team={team} />}
        {!isAdmin && <LeaveTeamButton />}
      </div>
      <UserTable users={users} role={role} pointsDict={pointsDict} />
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

  const users = await prisma.user.findMany({
    where: {
      teamId: session.user.teamId,
    },
    orderBy: {
      name: "asc",
    },
  });

  const team = await prisma.team.findUnique({
    where: {
      id: session.user.teamId,
    },
  });

  const issues = await prisma.issue.findMany({
    where: {
      teamId: session.user.teamId,
      backlog: "sprint",
    },
  });

  const pointsDict: PointsDict = calculatePoints(users, issues);

  return {
    props: { role: session.user.role, users, team, pointsDict },
  };
}
