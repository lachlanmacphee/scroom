import { useState } from "react";

type handleJoinTeamSubmit = (teamCode: string) => void;

export default function JoinTeam({
  handleJoinTeamSubmit,
  teamId,
}: {
  handleJoinTeamSubmit: handleJoinTeamSubmit;
  teamId?: string;
}) {
  const [teamCode, setTeamCode] = useState(teamId ?? "");
  return (
    <div className="flex rounded-lg border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800 sm:p-6 md:p-8">
      <div className="space-y-6">
        <h5 className="text-xl font-medium text-gray-900 dark:text-white">
          Join existing team
        </h5>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Team Code:
          </label>
          <input
            value={teamCode}
            onChange={(e) => setTeamCode(e.target.value)}
            type="text"
            placeholder={"Enter Team Code"}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
          />
        </div>
        <button
          type="button"
          className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={() => handleJoinTeamSubmit(teamCode)}
        >
          Join
        </button>
      </div>
    </div>
  );
}
