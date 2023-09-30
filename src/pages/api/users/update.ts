import { type NextApiRequest, type NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";

interface ExtendNextApiRequest extends NextApiRequest {
  body: {
    id: string;
    role: string;
  };
}

export default async function handleUpdateRole(
  req: ExtendNextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);

  if (session?.user.role !== "admin") {
    return res
      .status(401)
      .json({ error: "Only admins can change user roles." });
  }
  const { id, role } = req.body;
  const result = await prisma.user.update({
    where: { id },
    data: { role },
  });
  res.status(200).json(result);
}
