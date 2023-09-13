import React from "react";
import type { User } from "@prisma/client";
import Image from "next/image";

type handleRoleChange = (id: string, newRole: string) => Promise<void>;

interface userProps {
  user: User;
  handleRoleChange: handleRoleChange;
}

export default function UserRow({ user, handleRoleChange }: userProps) {
  function clickHandler(newRole: string) {
    handleRoleChange(user.id, newRole).catch((error) => {
      console.error("Error updating role:", error);
    });
  }

  if (!user.image || !user.name || !user.role) {
    return null;
  }

  return (
    <div className="flex justify-between border px-16 py-2">
      <div className="flex items-center gap-4">
        <Image
          className="rounded-full"
          src={user.image}
          alt={user.name}
          width="50"
          height="50"
        />
        <div>
          <p>{user.name}</p>
          <p className="text-xs font-thin">{user.email}</p>
        </div>
      </div>
      <select
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        defaultValue={user.role}
        onChange={(e) => clickHandler(e.target.value)}
      >
        <option value="admin">Admin</option>
        <option value="scrumMaster">Scrum Master</option>
        <option value="productOwner">Product Owner</option>
        <option value="proxyProductOwner">Proxy Product Owner</option>
        <option value="developer">Developer</option>
        <option value="guest">Guest</option>
      </select>
    </div>
  );
}
