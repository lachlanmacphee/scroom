/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import type { User } from "@prisma/client";
import type { Points } from "~/utils/types";
import RemoveMemberButton from "~/components/team/RemoveMemberButton";
import MemberStoryPoints from "~/components/team/MemberStoryPoints";
import { countAdmins } from "~/utils/funcs";
import AdminChangeRoleModal from "./AdminChangeRoleModal";
import { useRouter } from "next/router";
import RoleSelect from "./RoleSelect";

type handleRoleChange = (id: string, newRole: string) => Promise<void>;

interface userProps {
  user: User;
  users: User[];
  handleRoleChange: handleRoleChange;
  role: string;
  userPoints?: Points;
}

export default function UserRow({
  user,
  users,
  handleRoleChange,
  role,
  userPoints,
}: userProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const currentUser = session?.user;
  const [isAdminChangeRoleModalOpen, setIsAdminChangeRoleModalOpen] =
    useState(false);

  const renderRole = (role: string | null) => {
    switch (role) {
      case "admin":
        return " (Admin)";
      case "scrumMaster":
        return " (Scrum Master)";
      case "productOwner":
        return " (Product Owner)";
      case "proxyProductOwner":
        return " (Proxy Product Owner)";
      case "developer":
        return " (Developer)";
      case "guest":
        return " (Guest)";
      case null:
        return "";
    }
  };

  const clickHandler = async (newRole: string) => {
    const adminCount: number = countAdmins(users);
    if (
      adminCount === 1 &&
      currentUser?.id == user.id &&
      currentUser.role === "admin"
    ) {
      setIsAdminChangeRoleModalOpen(true);
    } else {
      setIsAdminChangeRoleModalOpen(false);
      handleRoleChange(user.id, newRole).catch((error) => {
        console.error("Error updating role:", error);
      });
      await router.replace(router.asPath);
    }
  };

  return (
    <>
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
            <p className="dark:text-white">
              {user.name ?? "undefined"}
              {currentUser != null &&
                currentUser.role !== "admin" &&
                renderRole(user.role)}
            </p>
            <p className="text-xs font-light dark:text-gray-400">
              {user.email}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          {user.role !== "admin" && role === "admin" && (
            <RemoveMemberButton user={user} />
          )}
          {role === "admin" && (
            <div className="flex space-x-4">
              <RoleSelect clickHandler={clickHandler} role={user.role}/>
            </div>
          )}
          {userPoints && <MemberStoryPoints points={userPoints} />}
        </div>
      </div>
      {isAdminChangeRoleModalOpen && <AdminChangeRoleModal />}
    </>
  );
}
