import { type GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";
import { prisma } from "~/server/db";
import { type Issue } from "@prisma/client";
import Link from "next/link";
import { useTour } from "@reactour/tour";

export default function Dashboard({ recentIssues }: { recentIssues: Issue[] }) {
  const { data: session } = useSession();
  const { setIsOpen } = useTour();

  return (
    <div className="flex flex-grow justify-center bg-white px-8 py-8 dark:bg-slate-700 md:px-48 md:py-48">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-center text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
          Welcome back to scroom, {session?.user.name ?? "undefined"}
        </h1>
        <div id="current-issues" className="flex flex-col items-center gap-2">
          <h1 className="pt-16 text-2xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-3xl lg:text-4xl">
            Current Issues
          </h1>
          {recentIssues?.length > 0 ? (
            recentIssues.map((issue) => (
              <span key={issue.id} className="dark:text-white">
                {issue.summary}
              </span>
            ))
          ) : (
            <span className="text-gray-500 dark:text-gray-400">
              No current issues. Create one in the{" "}
              <Link href="/backlog" className="text-blue-500">
                backlog
              </Link>
            </span>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={() => setIsOpen(true)}
        >
          Start Tour
        </button>
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

  const recentIssues = await prisma.issue.findMany({
    where: {
      teamId: session.user.teamId,
      userId: session.user.id,
    },
    select: {
      id: true,
      summary: true,
    },
    take: 5,
  });

  return {
    props: { recentIssues: recentIssues },
  };
}
