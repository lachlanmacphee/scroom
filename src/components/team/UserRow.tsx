/* eslint-disable @next/next/no-img-element */
import React from "react";
import type { User } from "@prisma/client";
import type { Points } from "~/utils/types";
import RemoveMemberButton from "~/components/team/RemoveMemberButton";
import MemberStoryPoints from "~/components/team/MemberStoryPoints";

type handleRoleChange = (id: string, newRole: string) => Promise<void>;

interface userProps {
  user: User;
  handleRoleChange: handleRoleChange;
  role: string;
  userPoints?: Points;
}

export default function UserRow({
  user,
  handleRoleChange,
  role,
  userPoints,
}: userProps) {
  function clickHandler(newRole: string) {
    handleRoleChange(user.id, newRole).catch((error) => {
      console.error("Error updating role:", error);
    });
  }

  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-3 shadow dark:border-gray-700 dark:bg-gray-800 md:flex-row md:gap-0">
      <div className="flex items-center gap-4">
        <img
          className="rounded-full"
          src={
            user.image ??
            `https://api.dicebear.com/7.x/bottts/png?seed=${user.email}`
          }
          alt="avatar"
          width="50"
          height="50"
        />
        <div>
          <p className="dark:text-white">{user.name ?? "undefined"}</p>
          <p className="text-xs font-light dark:text-gray-400">{user.email}</p>
        </div>
      </div>
      <div className="flex gap-4">
        {user.role !== "admin" && role === "admin" && (
          <RemoveMemberButton user={user} />
        )}
        {role === "admin" && (
          <div className="flex space-x-4">
            <select
              defaultValue={user.role ?? "guest"}
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
          </div>
        )}
        {userPoints && <MemberStoryPoints points={userPoints} />}
      </div>
    </div>
  );
}
