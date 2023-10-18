import type { User, Issue, Sprint } from "@prisma/client";
import type {
  ActualGraphDataType,
  BurndownGraphDataOutput,
  ContributionDataType,
  ExpectedGraphDataType,
  PointsDict,
  EditSprintSchema,
  NewSprintSchema,
} from "~/utils/types";
import { oneDayInMs } from "./constants";

export function convertRole(role: string) {
  if (role === "productOwner") return "Product Owner";
  if (role === "admin") return "Admin";
  if (role === "scrumMaster") return "Scrum Master";
  if (role === "guest") return "Guest";
  if (role === "developer") return "Developer";
  if (role === "proxyProductOwner") return "Proxy PO";
}

export function calculatePoints(users: User[], issues: Issue[]) {
  const pointsDict: PointsDict = {};

  users.forEach((user) => {
    const userIssues = issues.filter((issue) => issue.userId === user.id);
    const doneIssues = userIssues.filter((issue) => issue.status == "done");
    const donePoints = doneIssues
      .reduce(
        (accumulator, issue) => accumulator + (Number(issue.estimate) ?? 0),
        0,
      )
      .toString();
    const totalPoints = userIssues
      .reduce(
        (accumulator, issue) => accumulator + (Number(issue.estimate) ?? 0),
        0,
      )
      .toString();
    pointsDict[user.id] = { donePoints, totalPoints };
  });
  return pointsDict;
}

export function sortUsers({
  users,
  sortOrder,
  pointsDict,
}: {
  users: User[];
  sortOrder: string;
  pointsDict: PointsDict;
}) {
  return users.sort((a: User, b: User) => {
    if (sortOrder === "alphabetical") {
      if (a.name && b.name) {
        return a.name.localeCompare(b.name);
      }
    } else if (sortOrder === "points") {
      return (
        Number(pointsDict[b.id]?.donePoints) -
        Number(pointsDict[a.id]?.donePoints)
      );
    }
    return 0;
  });
}

export function convertToBurndownData(
  issues: Issue[],
  sprints: Sprint[],
  inputCurrentTime?: number,
): BurndownGraphDataOutput {
  const defaultBurndownReturn = {
    actualBurndownData: [],
    expectedBurndownData: [],
  };

  const completedIssues = issues.filter((issue) => issue.status === "done");
  // Finds the current sprint by determining if today's date is within the range
  // of an existing sprint
  const currentTime = inputCurrentTime ?? Date.now();
  const currentSprint = sprints.find(
    (sprint) =>
      sprint.startDate.getTime() <= currentTime &&
      currentTime <= sprint.endDate.getTime(),
  );

  // If no sprint was found, return an empty array of graph data
  if (!currentSprint) return defaultBurndownReturn;

  const sprintStartDate = currentSprint.startDate.getTime();
  const sprintEndDate = currentSprint.endDate.getTime();
  const daysInSprint = Math.abs(sprintEndDate - sprintStartDate) / oneDayInMs;

  const issueCompletionTimes = issues.map((issue) =>
    issue.dateCompleted ? issue.dateCompleted.getTime() : 0,
  );

  if (
    issueCompletionTimes.filter(
      (issueCompletionTime) => issueCompletionTime !== 0,
    ).length === 0
  )
    return defaultBurndownReturn;

  const daysIntoSprint =
    Math.abs(Math.max(...issueCompletionTimes) + oneDayInMs - sprintStartDate) /
    oneDayInMs;

  if (daysIntoSprint === Infinity) return defaultBurndownReturn;

  const pointsCompletedEachDay: Record<number, number> = {};
  completedIssues.forEach((issue) => {
    const dateCompleted = issue.dateCompleted?.getTime();
    if (!dateCompleted) return;
    const timeDifference = Math.abs(dateCompleted - sprintStartDate);
    const daysSinceSprintStart = Math.ceil(timeDifference / oneDayInMs);
    const numEstimate = Number(issue.estimate);
    const currentVal = pointsCompletedEachDay[daysSinceSprintStart];

    if (currentVal) {
      pointsCompletedEachDay[daysSinceSprintStart] = currentVal + numEstimate;
      return;
    }
    pointsCompletedEachDay[daysSinceSprintStart] = numEstimate;
  });

  // Now we have an object representing how many story points were completed on each day since the start

  const actualBurndownData: ActualGraphDataType[] = [];

  const totalPoints = issues.reduce(
    (accumulator, issue) => accumulator + Number(issue.estimate),
    0,
  );

  actualBurndownData.push({ day: 0, actual: totalPoints });

  for (let i = 1; i < daysIntoSprint; i++) {
    const pointsToRemove = pointsCompletedEachDay[i]
      ? pointsCompletedEachDay[i]
      : 0;
    actualBurndownData.push({
      day: i,
      actual: actualBurndownData[i - 1].actual - pointsToRemove,
    });
  }

  const expectedBurndownData: ExpectedGraphDataType[] = [
    { day: 0, expected: totalPoints },
    { day: daysInSprint, expected: 0 },
  ];

  return { actualBurndownData, expectedBurndownData };
}

export function convertToContributionData(
  issues: Issue[],
  users: User[],
): ContributionDataType[] {
  const assigneeData: Record<string, ContributionDataType> = {};
  if (issues.length === 0) return [];

  issues.forEach((issue) => {
    const { estimate, status, userId } = issue;
    const numEstimate = Number(estimate);
    const assignee = users.find((user) => user.id === userId);

    if (!userId || !assignee) return;
    if (assigneeData[userId]) {
      if (status === "done") {
        assigneeData[userId].completed += numEstimate;
      } else {
        assigneeData[userId].remaining += numEstimate;
      }
    } else {
      assigneeData[userId] = {
        name: assignee.name ?? "",
        completed: status === "done" ? numEstimate : 0,
        remaining: status === "done" ? 0 : numEstimate,
      };
    }
  });

  return Object.values(assigneeData);
}

export function sprintExists(
  currentSprints: Sprint[],
  data: EditSprintSchema | NewSprintSchema,
) {
  let alreadyExists = false;
  const dataStartDate = new Date(data.startDate);
  const dataEndDate = new Date(data.endDate);

  for (const s of currentSprints) {
    if (
      (dataStartDate.getTime() >= s.startDate.getTime() &&
        dataEndDate.getTime() <= s.endDate.getTime()) ||
      (dataStartDate.getTime() <= s.startDate.getTime() &&
        dataEndDate.getTime() >= s.startDate.getTime()) ||
      (dataEndDate.getTime() >= s.endDate.getTime() &&
        dataStartDate.getTime() <= s.endDate.getTime()) ||
      (dataStartDate.getTime() <= s.startDate.getTime() &&
        dataEndDate.getTime() >= s.endDate.getTime())
    ) {
      alreadyExists = true;
    }
  }
  return alreadyExists;
}

export function countAdmins(users: User[]): number {
  return users.filter((user) => user.role === "admin").length;
}
