import { prisma } from "~/server/db";
import type { NextApiResponse } from "next";

type RequestBody = {
  status: string;
  summary: string;
  backlog: string;
  teamId: string;
};

type RequestData = {
  body: RequestBody;
};

export default async function handleCreateIssue(
  req: RequestData,
  res: NextApiResponse,
) {
  const { status, summary, backlog, teamId } = req.body;
  const issue = await prisma.issue.create({
    data: {
      status: status,
      summary: summary,
      backlog: backlog,
      teamId: teamId,
    },
  });
  res.json(issue);
}
