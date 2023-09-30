import { prisma } from "~/server/db";
import type { NextApiRequest, NextApiResponse } from "next";

interface ExtendNextApiRequest extends NextApiRequest {
  body: {
    teamCode: string;
    userId: string;
  };
}

export default async function handleJoinTeam(
  req: ExtendNextApiRequest,
  res: NextApiResponse,
) {
  const { teamCode, userId } = req.body;

  try {
    const result = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        teamId: teamCode,
        role: "guest",
      },
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Team does not exist" });
  }
}
