import { prisma } from "~/server/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";

interface ExtendNextApiRequest extends NextApiRequest {
  body: {
    id: string;
    name: string;
    projectName: string;
  };
}

export default async function handleUpdateTeam(
  req: ExtendNextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);
  const { id, name, projectName } = req.body;

  if (session?.user.role !== "admin") {
    res.status(401);
  } else {
    const result = await prisma.team.update({
      data: {
        name: name,
        projectName: projectName,
      },
      where: {
        id: id,
      },
    });
    res.json(result);
  }

  res.end();
}
