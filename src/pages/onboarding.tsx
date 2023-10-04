import { type GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import JoinTeam from "~/components/onboarding/joinTeam";
import NewTeam from "~/components/onboarding/newTeam";

export default function Onboarding() {
  const router = useRouter();

  let { teamId } = router.query;
  const { data: session, update } = useSession();

  if (Array.isArray(teamId)) {
    teamId = teamId[0];
  }

  const handleNewTeamSubmit = async (teamName: string, projectName: string) => {
    try {
      const body = { teamName, projectName, userId: session?.user.id };
      await fetch(`/api/teams/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await router.push("/");
      await update();
    } catch (error) {
      console.error(error);
    }
  };

  const handleJoinTeamSubmit = async (teamCode: string) => {
    try {
      const body = { teamCode, userId: session?.user.id };
      await fetch(`/api/teams/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await router.push("/");
      await update();
    } catch (error) {
      console.error(error);
    }
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
