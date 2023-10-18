/* eslint-disable @next/next/no-img-element */
import { type GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "~/server/db";
import type { User, Team } from "@prisma/client";
import { FiEdit } from "react-icons/fi";
import { useState } from "react";
import UpdateNameModal from "~/components/profile/UpdateNameModal";
import InputGroup from "~/components/common/InputGroup";

export default function UserProfile({
  user,
  team,
}: {
  user: User;
  team: Team;
}) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
  };

  return (
    <div className="flex flex-grow flex-col bg-white px-12 pb-12 dark:bg-slate-700 ">
      <div className="flex justify-center p-5">
        <div className="flex flex-col items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-10 shadow dark:border-gray-700 dark:bg-gray-800 md:flex-row md:gap-0">
          <div>
            <div className="image-container group">
              <img
                src={user.image!}
                alt={`${user.name}'s Profile`}
                width={250}
                height={250}
                className="mx-auto rounded-full"
              />
            </div>

            <h1 className="mt-8 text-center text-2xl font-bold">
              <div className="flex items-center justify-center">
                <p className="dark:text-white">{user.name}</p>
                <button
                  onClick={() => {
                    setShowUpdateModal(true);
                  }}
                  className="ml-2 inline-flex items-center rounded-lg bg-blue-700 p-1.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <FiEdit fontSize="1em" />
                </button>
                {showUpdateModal && (
                  <UpdateNameModal
                    onClose={handleCloseUpdateModal}
                    name={user.name}
                    userID={user.id}
                    image={user.image}
                  />
                )}
              </div>
            </h1>
            <div className="flex flex-col gap-3">
              <InputGroup
                htmlFor="role"
                label="Role"
                labelStyles="font-semibold"
                type="text"
                disabled
                value={user.role!}
              />
              <InputGroup
                htmlFor="email"
                label="Email"
                labelStyles="font-semibold"
                type="text"
                disabled
                value={user.email!}
              />
              <InputGroup
                htmlFor="team"
                label="Team"
                labelStyles="font-semibold"
                type="text"
                disabled
                value={team.name}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
      },
    };
  }

  if (!session.user?.teamId) {
    return {
      redirect: {
        destination: "/onboarding",
      },
    };
  }
  const user = await prisma.user.findUnique({
    select: {
      id: true,
      name: true,
      image: true,
      role: true,
      email: true,
    },
    where: {
      id: session.user.id,
    },
  });

  const team = await prisma.team.findUnique({
    select: {
      name: true,
    },
    where: {
      id: session.user.teamId,
    },
  });

  return {
    props: { user, team },
  };
}
