import { useRouter } from "next/router";
import Modal from "../common/Modal";
import { type Team } from "@prisma/client";
import React, { useState } from "react";
import { FiUserPlus } from "react-icons/fi";
import { api } from "~/utils/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inviteMemberSchema, type InviteMemberSchema } from "~/utils/types";

export default function InviteMemberButton({ team }: { team: Team }) {
  const router = useRouter();
  const [isInviteTeamMemberModalOpen, setIsInviteTeamMemberModalOpen] =
    useState(false);
  const inviteMutation = api.team.invite.useMutation();

  const { register, handleSubmit } = useForm<InviteMemberSchema>({
    resolver: zodResolver(inviteMemberSchema),
  });

  const onSubmit = async (data: InviteMemberSchema) => {
    inviteMutation.mutate({
      teamId: team.id,
      toEmail: data.toEmail,
      teamName: team.name,
    });
    setIsInviteTeamMemberModalOpen(false);
    await router.replace(router.asPath);
  };

  const handleClose = () => {
    setIsInviteTeamMemberModalOpen(false);
  };
  return (
    <>
      <button
        data-testid="inviteTeamMemberButton"
        onClick={() => setIsInviteTeamMemberModalOpen(true)}
      >
        <FiUserPlus size="1.75em" className=" dark:stroke-white" />
      </button>
      {isInviteTeamMemberModalOpen && (
        <Modal
          onClose={handleClose}
          title="Invite New Team Member"
          data-testid="inviteMemberModal"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 p-4"
          >
            <div className="flex flex-col gap-1">
              <label className="dark:text-white">Team Members Email</label>
              <input
                type="email"
                data-testid="toEmailField"
                placeholder="john.smith@email.com"
                className="pl-2"
                {...register("toEmail", { required: true })}
              />
            </div>
            <div className="flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Send
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
