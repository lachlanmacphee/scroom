import { type GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

import { useSession }  from "next-auth/react"
import JoinTeam from "~/components/onboarding/joinTeam";
import NewTeam from "~/components/onboarding/newTeam";
export default function Home() {
  const router = useRouter();
  const { data: session, status} = useSession();

 

  const handleNewTeamSubmit = async (teamName: string, projectName: string)  => {
    try {
      if (status === "authenticated") {
        const userId = session.user.id

        const body = { teamName, projectName, userId };
        await fetch(`/api/createTeam`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        await router.push("/");}
      } catch (error) {
      console.error(error);
    }
  };


  const handleJoinTeamSubmit = async (teamCode: string) => {
    try{
      if (status === "authenticated") {
        const userId = session.user.id
      
      const body = {teamCode, userId};
      await fetch(`/api/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await router.push("/");
    }} catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <title className=" flex justify-center py-10 text-center text-5xl font-extrabold text-slate-600 ">
        Welcome to SCROOM!
      </title>
      <sub className="flex justify-center text-center font-bold text-3xl text-slate-400">Would you like to join an existing team or create a new team</sub>
      <main className="flex h-screen flex-row items-center flex-grow justify-center gap-10 self-center p-4">
        <JoinTeam handleJoinTeamSubmit={handleJoinTeamSubmit} />
        <NewTeam handleNewTeamSubmit={handleNewTeamSubmit} />
      </main>
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
