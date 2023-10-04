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
    estimate: string;
    type: string;
    userId: string | null;
  };
}
export default async function handleUpdateIssue(
  req: ExtendNextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);
  const { issueID, status, summary, backlog, estimate, type } = req.body;
  let userId = req.body.userId;

  if (backlog && session?.user.role !== "productOwner") {
    return res
      .status(401)
      .json({ error: "Only the product owner can perform this operation" });
  }
  if (userId === "") {
    userId = null;
  }
  const issue = await prisma.issue.update({
    where: {
      id: issueID,
    },
    data: {
      status: status,
      summary: summary,
      backlog: backlog,
      estimate: Number(estimate),
      type: type,
      userId: userId,
    },
  });
  res.status(200).json(issue);
}
