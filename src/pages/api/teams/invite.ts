/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextApiResponse, type NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { createTransport } from "nodemailer";
import { env } from "~/env.mjs";
import { authOptions } from "~/server/auth";

interface ExtendNextApiRequest extends NextApiRequest {
  body: {
    toEmail: string;
    teamId: string;
    teamName: string;
  };
}

export default async function sendInvite(
  req: ExtendNextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);

  const {
    body: { toEmail, teamId, teamName },
  } = req;

  if (session?.user.role !== "admin") {
    res.status(401);
  } else {
    const transporter = createTransport({
      pool: true,
      host: env.EMAIL_SERVER_HOST,
      port: parseInt(env.EMAIL_SERVER_PORT),
      secure: true,
      auth: {
        user: env.EMAIL_FROM,
        pass: env.EMAIL_SERVER_PASSWORD,
      },
    });

    const mailOptions = {
      from: env.EMAIL_FROM,
      to: toEmail,
      subject: "Team Invite",
      text:
        "You have been invited to join " +
        teamName +
        " on scroom!" +
        "Once you've signed up, click this link: " +
        `http://localhost:3000/onboarding?teamId=${teamId}`,
    };
    const info = await transporter.sendMail(mailOptions);
    res.json(info);
  }
  res.end();
}
