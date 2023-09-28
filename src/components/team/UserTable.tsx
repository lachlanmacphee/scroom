import UserRow from "~/components/team/UserRow";
import React from "react";
import type { User } from "@prisma/client";
import { useRouter } from "next/router";

export default function UserTable({
  users,
  role,
}: {
  users: User[];
  role: string;
}) {
  const router = useRouter();

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      const body = { id, newRole };
      await fetch(`/api/updateRole`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await router.replace(router.asPath);
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <div className="min-w-full overflow-hidden rounded-lg bg-white text-black">
      {users
        .sort((a, b) => {
          if (a.name && b.name) {
            return a.name.localeCompare(b.name);
          } else {
            return 0;
          }
        })
        .map((user) => (
          <UserRow
            key={user.id}
            user={user}
            handleRoleChange={handleRoleChange}
            role={role}
          />
        ))}
    </div>
  );
}
