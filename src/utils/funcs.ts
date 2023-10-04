import type { User, Issue } from "@prisma/client";
import type { PointsDict } from "~/utils/types";

export function convertRole(role: string) {
  if (role === "productOwner") return "Product Owner";
  if (role === "admin") return "Admin";
  if (role === "scrumMaster") return "Scrum Master";
  if (role === "guest") return "Guest";
}

export function calculatePoints(users: User[], issues: Issue[]) {
  const pointsDict: PointsDict = {};

  users.forEach((user) => {
    const userIssues = issues.filter((issue) => issue.userId === user.id);
    const doneIssues = userIssues.filter((issue) => issue.status == "done");
    const donePoints = doneIssues
      .reduce((accumulator, issue) => accumulator + (issue.estimate ?? 0), 0)
      .toString();
    const totalPoints = userIssues
      .reduce((accumulator, issue) => accumulator + (issue.estimate ?? 0), 0)
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
