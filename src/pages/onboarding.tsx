import { type GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import JoinTeam from "~/components/onboarding/joinTeam";
import NewTeam from "~/components/onboarding/newTeam";
import { api } from "~/utils/api";
export default function Onboarding() {
  const router = useRouter();

  let { teamId } = router.query;
  const { data: session, update } = useSession();
  const userId = session?.user.id;
  const createMutation = api.team.create.useMutation();
  const joinMutation = api.user.joinTeam.useMutation();

  if (Array.isArray(teamId)) {
    teamId = teamId[0];
  }

  const updateAndRedirect = async () => {
    await update();
    await router.push("/");
  };

  const handleNewTeamSubmit = (teamName: string, projectName: string) => {
    if (!userId) {
      return;
    }
    createMutation.mutate(
      { name: teamName, projectName, userId },
      { onSuccess: updateAndRedirect },
    );
  };

  const handleJoinTeamSubmit = (teamCode: string) => {
    if (!userId) {
      return;
    }
    joinMutation.mutate(
      { teamId: teamCode, userId, role: "guest" },
      { onSuccess: updateAndRedirect },
    );
  };

  return (
    <>
      <div className="flex flex-grow justify-center bg-white py-16 dark:bg-slate-700 ">
        <div className="flex flex-col items-center">
          <h1 className="mb-4 text-center text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
            Welcome to scroom!
          </h1>
          <p className="mb-6 text-center text-lg font-normal text-gray-500 dark:text-gray-400 sm:px-16 lg:text-xl xl:px-48">
            Would you like to join an existing team or create a new team?
          </p>
          <div className="flex gap-16">
            <JoinTeam
              handleJoinTeamSubmit={handleJoinTeamSubmit}
              teamId={teamId}
            />
            <NewTeam handleNewTeamSubmit={handleNewTeamSubmit} />
          </div>
        </div>
      </div>
    </>
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

  return {
    props: {},
  };
}
