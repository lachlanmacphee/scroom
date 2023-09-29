import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { TbLogout2 } from "react-icons/tb";

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <nav className="border-gray-200 bg-white dark:bg-gray-900">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <Link href="/" className="flex items-center">
          <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
            scroom
          </span>
        </Link>
        <div className="flex items-center md:order-2">
          <button
            onClick={() => void signOut()}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700  dark:text-gray-200 "
          >
            <TbLogout2 size="2em" />
          </button>
          {session?.user?.image && (
            <Image
              alt="avatar"
              src={session.user.image}
              width="32"
              height="32"
              className="rounded-full"
            />
          )}
        </div>
        {session?.user.teamId && (
          <div
            className="w-full items-center justify-between md:order-1 md:flex md:w-auto"
            id="navbar-user"
          >
            <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium dark:border-gray-700 dark:bg-gray-800 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0 md:dark:bg-gray-900">
              <li>
                <Link
                  href="/"
                  className={`block ${
                    router.route === "/"
                      ? "text-blue-500"
                      : "text-gray-900 dark:text-white"
                  } rounded px-3 py-2 md:p-0`}
                  aria-current="page"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/backlog"
                  className={`block ${
                    router.route === "/backlog"
                      ? "text-blue-500"
                      : "text-gray-900 dark:text-white"
                  } rounded px-3 py-2 md:p-0`}
                >
                  Backlog
                </Link>
              </li>
              <li>
                <Link
                  href="/board"
                  className={`block ${
                    router.route === "/board"
                      ? "text-blue-500"
                      : "text-gray-900 dark:text-white"
                  } rounded px-3 py-2 md:p-0`}
                >
                  Scrum Board
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className={`block ${
                    router.route === "/team"
                      ? "text-blue-500"
                      : "text-gray-900 dark:text-white"
                  } rounded px-3 py-2 md:p-0`}
                >
                  Team
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
