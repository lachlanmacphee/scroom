import { type ReactNode } from "react";
import Head from "next/head";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>scroom</title>
        <meta
          name="description"
          content="The simplest scrum management software"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col">
        <div className="flex h-20 w-full items-center justify-between bg-slate-500 px-4">
          <span className="text-white">scroom</span>
          <div className="flex gap-4">
            {session && (
              <button
                onClick={() => void signOut()}
                className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              >
                Sign Out
              </button>
            )}
            {session?.user?.image && (
              <Image
                alt="avatar"
                src={session.user.image}
                width="40"
                height="40"
                className="rounded-full"
              />
            )}
          </div>
        </div>
        {children}
      </main>
    </>
  );
}
