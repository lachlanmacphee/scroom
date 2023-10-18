/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState } from "react";
import { type GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";
import type { Issue, Team, User, Status, Sprint } from "@prisma/client";
import { prisma } from "~/server/db";
import { arrayMove } from "@dnd-kit/sortable";
import BacklogContainer from "~/components/backlog/BacklogContainer";
import { IssueItem } from "~/components/backlog/IssueItem";
import { backlogContainers } from "~/utils/constants";
import NewSprintButton from "~/components/backlog/NewSprintButton";
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
import EditSprintButton from "~/components/backlog/EditSprintButton";
import SuperJSON from "superjson";

export default function Backlog({
  dataIssues,
  team,
  teamUsers,
  statuses,
  sprintsJSON,
}: {
  dataIssues: Issue[];
  team: Team;
  teamUsers: User[];
  statuses: Status[];
  sprintsJSON: string;
}) {
  const sprints: Sprint[] = SuperJSON.parse(sprintsJSON);
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);
  const [activeContainer, setActiveContainer] = useState<string | null>(null);
  const [issues, setIssues] = useState<Issue[]>(dataIssues);
  const currentTime = new Date().getTime();
  const currentSprint =
    sprints.find(
      (sprint) =>
        sprint.startDate.getTime() <= currentTime &&
        currentTime <= sprint.endDate.getTime(),
    ) ?? undefined;
  const [selectedSprintId, setSelectedSprintId] = useState(
    currentSprint?.id ?? sprints[0]?.id ?? undefined,
  );
  const selectedSprint = sprints.find(
    (sprint) => sprint.id === selectedSprintId,
  );
  const { sprint: sprintBacklog, product: productBacklog } = backlogContainers;
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
    if (data.backlog === "sprint") {
      data.sprintId = selectedSprintId;
    } else {
      data.sprintId = null;
    }
    updateMutation.mutate({
      ...data,
      teamId,
    });
    const filteredIssues = issues.filter((issue) => issue.id !== data.id);
    const currentIssue = issues.find((issue) => issue.id === data.id);
    const updatedIssue = { ...currentIssue, ...data } as Issue;
    setIssues([...filteredIssues, updatedIssue]);
  };
  return (
    <div className="flex flex-grow flex-col bg-white px-12 pb-12 dark:bg-slate-700">
      <div className="flex flex-col items-center justify-center gap-2 pb-4 pt-8">
        <h1 className="text-center text-3xl font-bold dark:text-white">
          {team.projectName}
        </h1>
        <div className="flex items-center gap-2 text-center dark:text-white">
          <NewSprintButton sprints={sprints} />
          {sprints.length !== 0 && (
            <select
              className="block w-32 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              data-testid="sprintDropDown"
              value={selectedSprintId}
              onChange={(e) => setSelectedSprintId(e.target.value)}
            >
              {sprints.map((sprint) => (
                <option key={sprint.id} value={sprint.id}>
                  {sprint.name}
                </option>
              ))}
            </select>
          )}
          {sprints.length !== 0 && <EditSprintButton sprints={sprints} />}
        </div>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="grid grid-cols-1 gap-4">
          <BacklogContainer
            title={sprintBacklog.title}
            key={sprintBacklog.title}
            id={sprintBacklog.id}
            issues={
              (currentSprint &&
                issues.filter(
                  (issue) => issue.sprintId === selectedSprintId,
                )) ??
              []
            }
            teamUsers={teamUsers}
            updateIssue={updateIssue}
            statuses={statuses}
            sprint={selectedSprint ?? undefined}
          />
          <BacklogContainer
            title={productBacklog.title}
            key={productBacklog.title}
            id={productBacklog.id}
            issues={issues.filter((issue) => issue.backlog === "product")}
            teamUsers={teamUsers}
            updateIssue={updateIssue}
            statuses={statuses}
            sprint={currentSprint}
          />
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
      sprintId: true,
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

  const sprints = await prisma.sprint.findMany({
    where: {
      teamId: teamId,
    },
    orderBy: {
      startDate: "asc",
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
      teamId,
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
      sprintsJSON: SuperJSON.stringify(sprints),
    },
  };
}
