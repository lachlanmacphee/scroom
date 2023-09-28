import { type GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import React, { useState } from "react";
import { prisma } from "~/server/db";
import UserTable from "~/components/team/UserTable";
import type { User, Team } from "@prisma/client";
import { HiOutlinePencil } from "react-icons/hi";
import TeamDetailsModal from "~/components/team/TeamDetailsModal";

export default function Team({ users, team }: { users: User[]; team: Team }) {
  const [isTeamDetailsModalOpen, setIsTeamDetailsModalOpen] = useState(false);
  return (
    <>
      {isTeamDetailsModalOpen && (
        <TeamDetailsModal
          onClose={() => setIsTeamDetailsModalOpen(false)}
          team={team}
        />
      )}

      <div className="mb-4 mt-6 flex items-center justify-center gap-3">
        <div className="text-center">
          <h1 className="text-4xl font-semibold tracking-wide">{team.name}</h1>
          <h2 className=" text-3xl tracking-wide">{team.projectName}</h2>
        </div>

        <button
          data-testid="editTeamDetailsButton"
          onClick={() => setIsTeamDetailsModalOpen(true)}
        >
          <HiOutlinePencil fontSize="1.75em" />
        </button>
      </div>
      <UserTable users={users} />
    </>
  );
}

// This needs to be added to every page with current Next Auth implementation
// Middleware is not supported for database sessions
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user?.teamId) {
    return;
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      role: true,
      image: true,
      email: true,
    },
    where: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      teamId: user.teamId,
    },
  });

  const team = await prisma.team.findUnique({
    select: {
      id: true,
      name: true,
      projectName: true,
    },
    where: {
      id: user.teamId,
    },
  });

  return {
    props: { users, team },
  };
}
