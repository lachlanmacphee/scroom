import UserRow from "~/components/team/UserRow";
import React, { useState } from "react";
import type { User } from "@prisma/client";
import type { PointsDict } from "~/utils/types";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { sortUsers } from "~/utils/funcs";
import { api } from "~/utils/api";

export default function UserTable({
  users,
  role,
  pointsDict,
}: {
  users: User[];
  role: string;
  pointsDict: PointsDict;
}) {
  const router = useRouter();
  const { update } = useSession();
  const [sortOrder, setSortOrder] = useState("alphabetical");
  const sortedUsers = sortUsers({ users, sortOrder, pointsDict });
  const updateMutation = api.user.update.useMutation();

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      const body = { id, role: newRole };
      updateMutation.mutate(body);
      await router.replace(router.asPath);
      await update();
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <div className="flex flex-col gap-2 px-8">
      <div className="flex justify-end">
        <select
          className="block w-32 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="alphabetical">Alphabetical</option>
          <option value="points">Points</option>
        </select>
      </div>
      <div className="flex flex-col">
        {sortedUsers.map((user) => (
          <UserRow
            key={user.id}
            user={user}
            handleRoleChange={handleRoleChange}
            role={role}
            userPoints={pointsDict[user.id]}
          />
        ))}
      </div>
    </div>
  );
}
