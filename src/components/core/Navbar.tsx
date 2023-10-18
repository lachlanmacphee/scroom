/* eslint-disable @next/next/no-img-element */
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { TbLogout2 } from "react-icons/tb";
import { convertRole } from "~/utils/funcs";

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <nav className="border-gray-200 bg-white dark:bg-gray-900">
      <div className="mx-auto flex flex-wrap items-center justify-between p-4">
        <Link href="/" className="flex w-1/4 items-center">
          <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
            scroom
          </span>
        </Link>
        <div className="flex w-1/4 items-center justify-end md:order-3">
          {session?.user.role && (
            <p className="px-4 dark:text-white">
              {convertRole(session.user.role)}
            </p>
          )}
          <img
            alt="avatar"
            src={
              session?.user.image ??
              `https://api.dicebear.com/7.x/bottts/png?seed=${session?.user.email}`
            }
            width="32"
            height="32"
            className="rounded-full"
          />
          <button
            onClick={() => void signOut()}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700  dark:text-gray-200 "
          >
            <TbLogout2 size="2em" />
          </button>
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
                  id="navbar-dashboard"
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
                  id="navbar-backlog"
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
                  id="navbar-board"
                >
                  Board
                </Link>
              </li>
              <li>
                <Link
                  href="/charts"
                  className={`block ${
                    router.route === "/charts"
                      ? "text-blue-500"
                      : "text-gray-900 dark:text-white"
                  } rounded px-3 py-2 md:p-0`}
                  id="navbar-charts"
                >
                  Charts
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
                  id="navbar-team"
                >
                  Team
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className={`block ${
                    router.route === "/profile"
                      ? "text-blue-500"
                      : "text-gray-900 dark:text-white"
                  } rounded px-3 py-2 md:p-0`}
                  id="navbar-profile"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
