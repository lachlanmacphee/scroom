import { prisma } from "~/server/db";
import type { NextApiRequest, NextApiResponse } from "next";


interface ExtendNextApiRequest extends NextApiRequest {
  body: {
    teamName: string;
    projectName: string;
    userId: string;
  };
}


export default async function handleCreateTeam(req: ExtendNextApiRequest, res: NextApiResponse) {

  const { teamName, projectName, userId } = req.body;
  const team = await prisma.team.create({
    data: {
      name: teamName,
      projectName: projectName,
      
    },
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  res.json(team);
  // adding team Id to user
  const result = await prisma.user.update({
    where: {
        id: userId 
    },
    data: {
      teamId: team.id,
      role: "admin" 
    },
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  res.json(result);
}

