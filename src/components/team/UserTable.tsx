import UserRow from "~/components/team/UserRow";
import React from "react";
import type { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function UserTable({
  users,
  role,
}: {
  users: User[];
  role: string;
}) {
  const router = useRouter();
  const { update } = useSession();

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      const body = { id, role: newRole };
      await fetch(`/api/users/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await router.replace(router.asPath);
      await update();
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <div className="mx-12 flex flex-col md:mx-8">
      {users.map((user) => (
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
