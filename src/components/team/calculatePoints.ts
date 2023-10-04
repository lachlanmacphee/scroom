import type { User, Issue } from "@prisma/client";
import type { PointsDict } from "~/types";

export default function calculatePoints(users: User[], issues: Issue[]) {
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
