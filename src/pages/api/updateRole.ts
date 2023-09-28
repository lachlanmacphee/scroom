import { type NextApiRequest, type NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";

interface ExtendNextApiRequest extends NextApiRequest {
  body: {
    id: string;
    newRole: string;
  };
}

export default async function handleUpdateRole(
  req: ExtendNextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);

  if (session?.user.role !== "admin") {
    res.status(401);
  } else {
    const { id, newRole } = req.body;
    const result = await prisma.user.update({
      where: { id: id },
      data: { role: newRole },
    });
    res.json(result);
  }

  res.end();
}
