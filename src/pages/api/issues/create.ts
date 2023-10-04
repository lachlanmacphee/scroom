import { prisma } from "~/server/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";

interface ExtendNextApiRequest extends NextApiRequest {
  body: {
    summary: string;
    status: string;
    backlog: string;
    estimate: string;
    type: string;
    userId: string;
    teamId: string;
  };
}

export default async function handleUpdateIssue(
  req: ExtendNextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);
  const { status, summary, backlog, estimate, type, userId, teamId } = req.body;

  if (backlog && session?.user.role !== "productOwner") {
    res.status(401);
  } else {
    const issue = await prisma.issue.create({
      data: {
        status: status,
        summary: summary,
        backlog: backlog,
        estimate: Number(estimate),
        type: type,
        teamId: teamId,
        userId: userId === "" ? null : userId,
      },
    });

    res.json(issue);
  }

  res.end();
}
