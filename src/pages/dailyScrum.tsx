import React, { useEffect, useState } from "react";
import SuperJSON from "superjson";
import { type GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
// import { useRouter } from "next/router";
import { prisma } from "~/server/db";
import type { DailyScrum, User } from "@prisma/client";
import DailyScrumItem from "~/components/dailyScrum/DailyScrumItem";
import AddDailyScrumModal from "~/components/dailyScrum/AddDailyScrumModal";
// import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { api } from "~/utils/api";


export default function DailyScrum({
  teamUsers,
  dailyScrumsJSON,
  user,
}: {
  teamUsers: User[];
  dailyScrumsJSON: string;
  user: User;
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [dailyScrums, setDailyScrums] = useState<DailyScrum[]>(
    SuperJSON.parse(dailyScrumsJSON),
  );
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const todayString = today.toISOString();

  const userDailyScrum =
    dailyScrums.find((userDailyScrum) => userDailyScrum.userId === user.id) ??
    null;
  const [selectedDate, setSelectedDate] = useState<string>(todayString);

  const { data, refetch } = api.dailyScrum.get.useQuery({
    datePosted: selectedDate,
    teamId: user?.teamId ?? ""
  });

  const onDateChange = async (newDate: string) => {
    const formattedDate = new Date(newDate);
    formattedDate.setUTCHours(0, 0, 0, 0);
    setSelectedDate(formattedDate.toISOString());
    await refetch();
  };

  useEffect(() => {
    if (data) {
      setDailyScrums(data);
    }
  }, [data]);

  return (
    <>
      {showAddModal && (
        <AddDailyScrumModal
          onClose={() => setShowAddModal(false)}
          user={user}
        />
      )}
      <div className="flex flex-grow flex-col bg-white px-12 pb-12 dark:bg-slate-700">
        <div className="flex pb-4 pt-8">
          <h1 className="flex-auto text-center text-3xl font-bold dark:text-white">
            Daily Scrum
          </h1>
        </div>
        <div className="flex flex-row">
          <div className="flex-1">
            <div className="items-centre left-0 top-0 z-20 flex w-full justify-center border-b-2 border-t-2 border-gray-200 bg-white py-2 dark:border-slate-600 dark:bg-slate-700">
              <div className="flex-col justify-center">
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-3xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                  type="date"
                  value={selectedDate.slice(0, 10)}
                  onChange={(e) => onDateChange(e.target.value)}
                />
              </div>
            </div>
            <div className="h-auto p-4">
              <p className="p-2 text-lg dark:text-white">My Daily Scrum</p>
              {userDailyScrum == null && selectedDate === todayString && (
                <button
                  className="h-20 w-full rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-400 dark:text-white text-4xl"
                  onClick={() => setShowAddModal(true)}
                >
                  +
                </button>
              )}
              {userDailyScrum == null && selectedDate != todayString && (
                <div className="flex h-20 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-400">
                  <p className="text-center text-xs dark:text-white ">No data on this day</p>
                </div>
              )}
              {userDailyScrum != null && (
                <DailyScrumItem
                  key={userDailyScrum.id}
                  dailyScrum={userDailyScrum}
                  user={user}
                />
              )}
              <p className="p-2 pt-6 text-lg dark:text-white">
                My Team&apos;s Daily Scrums
              </p>
              <div>
                {dailyScrums.map((dailyScrum) => {
                  const teamUser = teamUsers.find(
                    (teamUser) => teamUser.id === dailyScrum.userId,
                  );
                  if (teamUser && teamUser.id !== user.id)
                    return (
                      <DailyScrumItem
                        key={dailyScrum.id}
                        dailyScrum={dailyScrum}
                        user={teamUser}
                      />
                    );
                })}
              </div>
            </div>
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

  if (!session.user?.teamId) {
    return {
      redirect: {
        destination: "/onboarding",
      },
    };
  }

  const user = session.user;
  const teamId = user.teamId;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const ISOstring = today.toISOString();

  const dailyScrums = await prisma.dailyScrum.findMany({
    select: {
      id: true,
      yesterday: true,
      today: true,
      blockers: true,
      datePosted: true,
      userId: true,
    },
    where: {
      teamId: teamId,
      datePosted: ISOstring,
    },
  });

  const teamUsers = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      teamId: true,
      role: true,
      image: true,
    },
    where: {
      teamId: teamId,
    },
  });

  return {
    props: {
      teamUsers,
      dailyScrumsJSON: SuperJSON.stringify(dailyScrums),
      user,
    },
  };
}
