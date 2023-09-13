import { useState } from "react";

type handleNewTeamSubmit = (teamName:string, projectName: string) => Promise<void>; 
  


export default function NewTeam({handleNewTeamSubmit}: {handleNewTeamSubmit:handleNewTeamSubmit}) {
  const [teamName, setTeamName] = useState("");
  const [projectName, setProjectName] = useState("");
  return (
    <div className=" w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
      <div className="space-y-6">
          <h5 className=" text-xl font-medium text-gray-900 dark:text-white">Create a new team</h5>
          <div>
            <label className=" block mb-2 text-sm font-medium text-gray-900 dark:text-white">Team Name</label>
            <input value={teamName} onChange={(e) => setTeamName(e.target.value)} type="text" placeholder={"Enter Team Name"} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"/>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Project Name</label>
            <input value={projectName} onChange={(e) => setProjectName(e.target.value)} type="text" placeholder={"Enter Project Name"} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"/>
          </div>
          <button type="button" className=" w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={() => handleNewTeamSubmit(teamName,projectName)}>Join your new team</button>
      </div>    
    </div>
  )
}

