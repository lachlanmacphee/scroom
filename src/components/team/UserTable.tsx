import UserRow from "~/components/team/UserRow";
import React from "react";
import type { User } from "@prisma/client";

export default function UserTable({ users }: { users: User[] }) {
  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      const body = { id, newRole };
      await fetch(`/api/updateRole`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
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
          />
        ))}
    </div>
  );
}
