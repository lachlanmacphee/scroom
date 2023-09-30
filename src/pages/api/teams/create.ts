import { prisma } from "~/server/db";
import type { NextApiRequest, NextApiResponse } from "next";

interface ExtendNextApiRequest extends NextApiRequest {
  body: {
    teamName: string;
    projectName: string;
    userId: string;
  };
}

export default async function handleCreateTeam(
  req: ExtendNextApiRequest,
  res: NextApiResponse,
) {
  const { teamName, projectName, userId } = req.body;
  const teamResult = await prisma.team.create({
    data: {
      name: teamName,
      projectName: projectName,
    },
  });
  const userResult = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      teamId: teamResult.id,
      role: "admin",
    },
  });
  res.status(200).json({ ...teamResult, ...userResult });
}
