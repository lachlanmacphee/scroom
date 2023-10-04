import { type GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import type { Issue, Team, User } from "@prisma/client";
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

export default function Backlog({
  dataIssues,
  team,
  teamUsers,
}: {
  dataIssues: Issue[];
  teamId: string;
  team: Team;
  teamUsers: User[];
}) {
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);
  const [activeContainer, setActiveContainer] = useState<string | null>(null);
  const [issues, setIssues] = useState<Issue[]>(dataIssues);

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

  const updateIssue = async (
    issueID: string,
    summary: string,
    status: string,
    backlog: string,
  ) => {
    try {
      const body = { issueID, summary, status, backlog };
      await fetch(`/api/issues/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-grow flex-col bg-white px-12 dark:bg-slate-700">
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
            />
          ))}
        </div>
        <DragOverlay adjustScale={false}>
          {activeIssue && (
            <IssueItem issue={activeIssue} teamUsers={teamUsers} />
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

  async function onDragEnd(event: DragEndEvent) {
    const { over } = event;

    if (over?.data?.current?.type === "issue" && activeIssue) {
      if (over.data.current.issue) {
        await updateIssue(
          activeIssue.id,
          activeIssue.summary,
          activeIssue.status ?? "toDo",
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          over.data.current.issue.backlog,
        );
        return;
      }
    }

    if (
      over?.data?.current?.type === "container" &&
      activeIssue &&
      activeContainer
    ) {
      await updateIssue(
        activeIssue.id,
        activeIssue.summary,
        activeIssue.status ?? "toDo",
        activeContainer,
      );
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

  return {
    props: {
      teamUsers,
      dataIssues,
      teamId,
      team,
    },
  };
}
