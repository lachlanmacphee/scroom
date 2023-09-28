import { prisma } from "~/server/db";
import type { NextApiRequest, NextApiResponse } from "next";

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
  const { id, name, projectName } = req.body;
  const result = await prisma.team.update({
    data: {
      name: name,
      projectName: projectName,
    },
    where: {
      id: id,
    },
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  res.json(result);
}
