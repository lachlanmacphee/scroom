import React, { useState } from "react";
import type { User } from "@prisma/client";
import { useRouter } from "next/router";
import { BsFillPersonDashFill } from "react-icons/bs";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { countAdmins } from "~/utils/funcs";
import LeaveTeamModal from "./LeaveTeamModal";

export default function LeaveTeamButton({ users }: { users: User[] }) {
  const router = useRouter();
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const { data: session } = useSession();
  const adminCount: number = countAdmins(users);
  const leaveMutation = api.team.remove.useMutation();
  const deleteMutation = api.team.delete.useMutation();

  const endSubmit = async () => {
    setIsLeaveModalOpen(false);
    await router.replace(router.asPath);
  };

  const handleLeaveTeam = () => {
    if (!session?.user.id) return;
    leaveMutation.mutate(
      { userId: session?.user.id },
      { onSuccess: endSubmit },
    );
  };

  const handleDeleteTeam = () => {
    if (!session?.user.id) return;
    deleteMutation.mutate(
      { teamId: session?.user.teamId },
      { onSuccess: endSubmit },
    );
  };

  return (
    <>
      {isLeaveModalOpen && (
        <LeaveTeamModal
          handleClose={() => setIsLeaveModalOpen(false)}
          adminCount={adminCount}
          usersCount={users.length}
          handleLeaveTeam={handleLeaveTeam}
          handleDeleteTeam={handleDeleteTeam}
        />
      )}
      <button
        data-testid="leaveTeamButton"
        onClick={() => setIsLeaveModalOpen(true)}
      >
        <BsFillPersonDashFill size="1.75em" className="dark:fill-white" />
      </button>
    </>
  );
}
