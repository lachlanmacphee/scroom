import { prisma } from "~/server/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";

interface ExtendNextApiRequest extends NextApiRequest {
  body: {
    issueId: string;
  };
}

export default async function handleUpdateIssue(
  req: ExtendNextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);
  const { issueId } = req.body;

  if (session?.user.role !== "productOwner") {
    res.status(401);
  } else {
    const issue = await prisma.issue.delete({
      where: {
        id: issueId,
      },
    });

    res.json(issue);
  }

  res.end();
}
