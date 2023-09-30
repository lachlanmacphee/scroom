import { prisma } from "~/server/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";

interface ExtendNextApiRequest extends NextApiRequest {
  body: {
    issueID: string;
    summary: string;
    status: string;
    backlog: string;
  };
}

export default async function handleUpdateIssue(
  req: ExtendNextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);
  const { issueID, status, summary, backlog } = req.body;

  if (backlog && session?.user.role !== "productOwner") {
    res.status(401);
  } else {
    const issue = await prisma.issue.update({
      where: {
        id: issueID,
      },
      data: {
        status: status,
        summary: summary,
        backlog: backlog,
      },
    });
    res.json(issue);
  }

  res.end();
}
