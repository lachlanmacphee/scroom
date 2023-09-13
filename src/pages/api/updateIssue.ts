import { prisma } from "~/server/db";
import type { NextApiResponse } from "next";

type RequestBody = {
  issueID: string;
  summary: string;
  status: string;
  backlog: string;
};

type RequestData = {
  body: RequestBody;
};

export default async function handleUpdateIssue(
  req: RequestData,
  res: NextApiResponse,
) {
  const { issueID, status, summary, backlog } = req.body;
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
