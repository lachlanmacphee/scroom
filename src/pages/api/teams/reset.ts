import { prisma } from "~/server/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";

interface ExtendNextApiRequest extends NextApiRequest {
  body: {
    teamId: string;
  };
}

export default async function handleUpdateTeam(
  req: ExtendNextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);
  const { teamId } = req.body;

  if (session?.user.role !== "admin") {
    return res.status(401).json({ error: "Only admins can reset a team." });
  }

  const issueResult = await prisma.issue.deleteMany({
    where: {
      teamId: teamId,
    },
  });
  const userResult = await prisma.user.updateMany({
    where: {
      teamId: teamId,
      role: {
        not: {
          equals: "admin",
        },
      },
    },
    data: {
      teamId: null,
    },
  });
  res.status(200).json({ ...issueResult, ...userResult });
}
