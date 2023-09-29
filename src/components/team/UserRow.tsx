import React from "react";
import type { User } from "@prisma/client";
import Image from "next/image";

type handleRoleChange = (id: string, newRole: string) => Promise<void>;

interface userProps {
  user: User;
  handleRoleChange: handleRoleChange;
  role: string;
}

export default function UserRow({ user, handleRoleChange, role }: userProps) {
  function clickHandler(newRole: string) {
    handleRoleChange(user.id, newRole).catch((error) => {
      console.error("Error updating role:", error);
    });
  }
  console.log(role);

  if (!user.image || !user.name || !user.role) {
    return null;
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center gap-4">
        <Image
          className="rounded-full"
          src={user.image}
          alt={user.name}
          width="50"
          height="50"
        />
        <div>
          <p className="dark:text-white">{user.name}</p>
          <p className="text-xs font-light dark:text-gray-400">{user.email}</p>
        </div>
      </div>
      {role === "admin" && (
        <select
          defaultValue={user.role}
          className="rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          onChange={(e) => clickHandler(e.target.value)}
          data-testid="roleSelectDropdown"
        >
          <option value="admin">Admin</option>
          <option value="scrumMaster">Scrum Master</option>
          <option value="productOwner">Product Owner</option>
          <option value="proxyProductOwner">Proxy Product Owner</option>
          <option value="developer">Developer</option>
          <option value="guest">Guest</option>
        </select>
      )}
    </div>
  );
}
