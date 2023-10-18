/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState } from "react";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";
import { type GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";
import type { Issue, Team, User, Status, Sprint } from "@prisma/client";
import IssueContainer from "~/components/board/IssueContainer";
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { AiOutlinePlus } from "react-icons/ai";
import { useRouter } from "next/router";
import SuperJSON from "superjson";

export default function ScrumBoard({
  issues,
  team,
  statuses,
  teamUsers,
  sprintsJSON,
}: {
  issues: Issue[];
  team: Team;
  statuses: Status[];
  teamUsers: User[];
  sprintsJSON: string;
}) {
  const sprints: Sprint[] = SuperJSON.parse(sprintsJSON);
  const updateMutation = api.issue.update.useMutation();
  const statusMutation = api.status.create.useMutation();
  const deleteMutation = api.status.delete.useMutation();

  const router = useRouter();
  const { data: session } = useSession();

  const [isCreatingColumn, setIsCreatingColumn] = useState(false);

  const addStatus = (title: string, value: string) => {
    return new Promise<void>((resolve, reject) => {
      const teamId = session?.user.teamId;
      if (!teamId) {
        reject(new Error("Team ID is missing"));
        return;
      }

      statusMutation.mutate(
        { title, value, teamId },
        {
          onSuccess: async () => {
            await router.replace(router.asPath);
            resolve();
          },
          onError: (error) => {
            reject(error);
          },
        },
      );
    });
  };

  const updateIssue = (id: string, status: string) => {
    const teamId = session?.user.teamId;
    if (!teamId) return;
    updateMutation.mutate({ id, status, teamId });
  };

  const deleteStatus = (id: string) => {
    deleteMutation.mutate(
      { id },
      {
        onSuccess: async () => {
          await router.replace(router.asPath);
        },
      },
    );
  };

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeIssue = issues.find(
      (issue) => issue.id === active.id.toString(),
    );

    if (activeIssue) {
      if (activeIssue.status == over.id.toString()) return;
      activeIssue.status = over.id.toString();
      updateIssue(active.id.toString(), over.id.toString());
    }
  }
  const currentTime = new Date().getTime();
  const currentSprint =
    sprints.find(
      (sprint) =>
        sprint.startDate.getTime() <= currentTime &&
        currentTime <= sprint.endDate.getTime(),
    ) ?? null;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Enables modal to be opened if just clicking
      // Drag wont start working until issue moved 10 px
      activationConstraint: {
        distance: 10,
      },
    }),
  );

  return (
    <div className="flex flex-grow flex-col bg-white dark:bg-slate-700">
      <div className="py-4 text-center">
        <h1 className="text-3xl font-bold dark:text-white">Scrum Board</h1>
        <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
          {team.projectName}
        </h2>
        <h3 className="text-2xl font-semibold text-gray-400 dark:text-gray-200">
          Current Sprint: {currentSprint?.name}
        </h3>
      </div>
      <div className="flex justify-end p-5">
        <button
          onClick={() => {
            void createNewColumn();
          }}
          disabled={isCreatingColumn}
          className="rounded-full bg-gray-800 p-2.5 shadow-lg"
        >
          <AiOutlinePlus size="1em" color="white" />
        </button>
      </div>
      <DndContext onDragEnd={onDragEnd} sensors={sensors}>
        <div className="flex gap-2 px-2">
          {statuses.map((col) => (
            <IssueContainer
              key={col.value}
              containerValue={col.value}
              containerTitle={col.title}
              containerId={col.id}
              issues={issues.filter((issue) => issue.status === col.value)}
              deleteColumn={deleteColumn}
              teamUsers={teamUsers}
              statuses={statuses}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );

  async function createNewColumn() {
    if (isCreatingColumn) {
      return;
    }
    setIsCreatingColumn(true);
    const newColumn = {
      title: `Column ${statuses.length + 1}`,
      value: `column${statuses.length + 1}`,
    };

    await addStatus(newColumn.title, newColumn.value);

    setIsCreatingColumn(false);
  }

  function deleteColumn(id: string) {
    deleteStatus(id);
  }
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

  const sprints = await prisma.sprint.findMany({
    where: {
      teamId: session.user.teamId,
    },
    orderBy: {
      startDate: "asc",
    },
  });

  const currentTime = new Date().getTime();
  const currentSprint =
    sprints.find(
      (sprint) =>
        sprint.startDate.getTime() <= currentTime &&
        currentTime <= sprint.endDate.getTime(),
    ) ?? null;

  const issues = await prisma.issue.findMany({
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
      sprintId: currentSprint?.id,
      backlog: "sprint",
      teamId: session.user.teamId,
    },
    orderBy: {
      estimate: { sort: "desc", nulls: "last" },
    },
  });

  const team = await prisma.team.findUnique({
    select: {
      id: true,
      projectName: true,
    },
    where: {
      id: session.user.teamId,
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
      teamId: session.user.teamId,
    },
  });

  const statuses = await prisma.status.findMany({
    select: {
      id: true,
      value: true,
      title: true,
    },
    where: {
      teamId: session.user.teamId,
    },
  });

  return {
    props: {
      issues,
      team,
      teamUsers,
      statuses,
      sprintsJSON: SuperJSON.stringify(sprints),
    },
  };
}
