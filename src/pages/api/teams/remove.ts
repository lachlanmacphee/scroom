import { prisma } from "~/server/db";
import type { NextApiRequest, NextApiResponse } from "next";

interface ExtendNextApiRequest extends NextApiRequest {
  body: {
    userId: string;
  };
}

export default async function handleRemoveMember(
  req: ExtendNextApiRequest,
  res: NextApiResponse,
) {
  const { userId } = req.body;
  
  try {
    const result = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        teamId: null,
        role: null,
      },
    });
    await prisma.issue.updateMany({
      where: {
        userId: userId,
      },
      data: {
        userId: null,
      },
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to remove user from team" });
  }
}
