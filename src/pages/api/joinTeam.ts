import { prisma } from "~/server/db";
import type { NextApiRequest, NextApiResponse } from "next";



interface ExtendNextApiRequest extends NextApiRequest {
  body: {
    teamCode: string;
    userId: string;
  };
}


export default async function handleJoinTeam(req: ExtendNextApiRequest, res: NextApiResponse) {
  const { teamCode, userId } = req.body;
  // checks if team exists.
  const exists = await prisma.team.findFirst(
    {
      where: {
        id: teamCode
      }
    }
  )
  if (exists !== null) {
    // adding  team ID to user.
    const result = await prisma.user.update({
      where: {
          id: userId 
      },
      data: {
        teamId: teamCode,
        role: "guest"
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    res.json(result);
  }
  else {
    console.error("team does not exist")
  }
  
}