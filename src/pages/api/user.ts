import { prisma } from "~/server/db";

interface body {
  id: string;
  newRole: string;
}

interface req {
  body: body;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handleUpdateRole(req: req, res: any) {
  const { id, newRole } = req.body;
  const result = await prisma.user.update({
    where: { id: id },
    data: { role: newRole },
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  res.json(result);
}
