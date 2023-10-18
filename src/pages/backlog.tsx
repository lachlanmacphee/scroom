/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState } from "react";
import { type GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";
import type { Issue, Team, User, Status } from "@prisma/client";
import { prisma } from "~/server/db";
import { arrayMove } from "@dnd-kit/sortable";
import BacklogContainer from "~/components/backlog/BacklogContainer";
import { IssueItem } from "~/components/backlog/IssueItem";
import { containers } from "~/utils/constants";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { api } from "~/utils/api";
import { type UpdateIssueInputs } from "~/utils/types";

export default function Backlog({
  dataIssues,
  team,
  teamUsers,
  statuses
}: {
  dataIssues: Issue[];
  teamId: string;
  team: Team;
  teamUsers: User[];
  statuses: Status[];
}) {
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);
  const [activeContainer, setActiveContainer] = useState<string | null>(null);
  const [issues, setIssues] = useState<Issue[]>(dataIssues);
  const updateMutation = api.issue.update.useMutation();
  const { data: session } = useSession();

  useEffect(() => {
    setIssues(dataIssues);
  }, [dataIssues]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Distance 10 is given so that the object only starts dragging after being moved 10 pixels
      // Used to allow user to tap on edit button, change the summary etc
      activationConstraint: {
        distance: 10,
      },
    }),
  );

  const updateIssue = (data: UpdateIssueInputs) => {
    const teamId = session?.user.teamId;
    if (!teamId) return;
    updateMutation.mutate({ ...data, teamId });
  };

  return (
    <div className="flex flex-grow flex-col bg-white px-12 pb-12 dark:bg-slate-700">
      <div className="flex pb-4 pt-8">
        <h1 className="flex-auto text-center text-3xl font-bold dark:text-white">
          {team.projectName}
        </h1>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="grid grid-cols-1 gap-4">
          {containers.map((container) => (
            <BacklogContainer
              title={container.title}
              key={container.title}
              id={container.id}
              issues={issues.filter((issue) => issue.backlog === container.id)}
              teamUsers={teamUsers}
              updateIssue={updateIssue}
              statuses={statuses}
            />
          ))}
        </div>
        <DragOverlay adjustScale={false}>
          {activeIssue && (
            <IssueItem
              issue={activeIssue}
              teamUsers={teamUsers}
              updateIssue={updateIssue}
              statuses={statuses}
            />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "issue") {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setActiveIssue(event.active.data.current.issue);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    const { over } = event;

    if (over?.data?.current?.type === "issue" && activeIssue) {
      if (over.data.current.issue.backlog) {
        updateIssue({
          id: activeIssue.id,
          summary: activeIssue.summary,
          status: activeIssue.status ?? "toDo",
          backlog: over.data.current.issue.backlog,
        });
        return;
      }
    }

    if (
      over?.data?.current?.type === "container" &&
      activeIssue &&
      activeContainer
    ) {
      updateIssue({
        id: activeIssue.id,
        summary: activeIssue.summary,
        status: activeIssue.status ?? "toDo",
        backlog: activeContainer,
      });
    }

    setActiveIssue(null);
    setActiveContainer(null);
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAIssue = active.data.current?.type === "issue";
    const isOverAIssue = over.data.current?.type === "issue";

    if (!isActiveAIssue) return;

    if (isActiveAIssue && isOverAIssue) {
      setIssues((issues) => {
        const activeIndex = issues.findIndex((t) => t.id === activeId);
        const overIndex = issues.findIndex((t) => t.id === overId);

        issues[activeIndex]!.backlog = issues[overIndex]!.backlog;

        return arrayMove(issues, activeIndex, overIndex);
      });
    }

    const isOverAContainer = over.data.current?.type === "container";

    if (isActiveAIssue && isOverAContainer) {
      setIssues((issues) => {
        const activeIndex = issues.findIndex((t) => t.id === activeId);
        issues[activeIndex]!.backlog = over.id as string;
        setActiveContainer(over.id as string);
        return arrayMove(issues, activeIndex, activeIndex);
      });
    }
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
    return {
      redirect: {
        destination: "/onboarding",
      },
    };
  }

  const teamId = session.user.teamId;

  const dataIssues = await prisma.issue.findMany({
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
      teamId: teamId,
    },
  });

  const team = await prisma.team.findUnique({
    select: {
      id: true,
      name: true,
      projectName: true,
    },
    where: {
      id: teamId,
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

  const statuses = await prisma.status.findMany({
    select: {
      value: true,
      title: true,
    },
    where: {
      teamId: session.user.teamId,
    },
  });

  return {
    props: {
      teamUsers,
      dataIssues,
      teamId,
      team,
      statuses,
    },
  };
}
