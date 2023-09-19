import { useState } from "react";

type handleJoinTeamSubmit = (teamCode:string) => Promise<void>

export default function JoinTeam({handleJoinTeamSubmit} : {handleJoinTeamSubmit: handleJoinTeamSubmit}) {
    const [teamCode, setTeamCode] = useState("");
    return (
    <div className="flex  max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
          <div className=" space-y-6">
            <h5 className="text-xl font-medium text-gray-900 dark:text-white">Join existing team</h5>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Team Code:</label>
              <input value={teamCode} onChange={(e) => setTeamCode(e.target.value)} type="text" placeholder={"Enter Team Code"} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"/>
            </div>
            <button type="button" className=" w-full justify-self-end text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={() => handleJoinTeamSubmit(teamCode)}>Join your team</button>
            </div>
        </div>
    )
}