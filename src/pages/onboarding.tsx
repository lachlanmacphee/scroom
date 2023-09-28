import { type GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

import { useSession } from "next-auth/react";
import JoinTeam from "~/components/onboarding/JoinTeam";
import NewTeam from "~/components/onboarding/NewTeam";
export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleNewTeamSubmit = async (teamName: string, projectName: string) => {
    try {
      if (status === "authenticated") {
        const userId = session.user.id;

        const body = { teamName, projectName, userId };
        await fetch(`/api/createTeam`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        await router.push("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleJoinTeamSubmit = async (teamCode: string) => {
    try {
      if (status === "authenticated") {
        const userId = session.user.id;

        const body = { teamCode, userId };
        await fetch(`/api/joinTeam`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        await router.push("/");
      }
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
        <JoinTeam handleJoinTeamSubmit={handleJoinTeamSubmit} />
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
