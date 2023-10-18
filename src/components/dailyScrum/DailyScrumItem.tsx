import React, { useState } from "react";
import type { DailyScrum, User } from "@prisma/client";
import Image from "next/image";
import { FiEdit } from "react-icons/fi";
import AddDailyScrumModal from "./AddDailyScrumModal";
import { useSession } from "next-auth/react";

export default function DailyScrumItem({
  dailyScrum,
  user,
}: {
  dailyScrum: DailyScrum;
  user: User;
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  
  const editHandler = () => {
    setShowAddModal(true);
  };
  const { data: session } = useSession();

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const todayString = today.toISOString();

  return (
    <>
      {showAddModal && (
          <AddDailyScrumModal
            onClose={() => setShowAddModal(false)}
            user = {user}
            dailyScrum={dailyScrum}
          />
        )}
      <div className="flex flex-col items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-3 shadow dark:border-gray-700 dark:bg-gray-800 md:flex-row md:gap-0">
        <div className="flex items-center gap-4">
          <Image
            className="rounded-full"
            src={
              user.image ??
              `https://api.dicebear.com/7.x/bottts/png?seed=${user.email}`
            }
            alt="avatar"
            width="50"
            height="50"
          />
          <div>
            <p className="dark:text-white">{user.name ?? "undefined"}</p>
            <p className="text-xs font-light dark:text-gray-400">
              <b>Yesterday: </b>
              {dailyScrum.yesterday}
            </p>
            <p className="text-xs font-light dark:text-gray-400">
              <b>Today: </b>
              {dailyScrum.today}
            </p>
            <p className="text-xs font-light dark:text-gray-400">
              <b>Blockers: </b>
              {dailyScrum.blockers}
            </p>
          </div>
        </div>
        { (dailyScrum.datePosted.toISOString() == todayString) && (user.id == session?.user.id) && (<button
          className="mr-2 inline-flex items-center rounded-lg bg-blue-700 p-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={() => editHandler()}
          data-testid="edit-button"
        >
          <FiEdit fontSize="1.5em" />
        </button>
        )}
      </div>
    </>
  );
}
