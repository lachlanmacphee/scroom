import type { User } from "@prisma/client";
import type { PointsDict } from "~/types";

export default function sortUsers({
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
