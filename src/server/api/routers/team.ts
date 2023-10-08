import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { createTransport } from "nodemailer";
import { env } from "~/env.mjs";

export const teamRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        projectName: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ input: { name, projectName, userId } }) => {
      const team = await prisma.team.create({
        data: { name, projectName },
      });
      const user = await prisma.user.update({
        where: { id: userId },
        data: { teamId: team.id, role: "admin" },
      });
      return { team, user };
    }),

  // Only admins can update the team and project
  // if (session?.user.role !== "admin") {
  //   return res
  //     .status(401)
  //     .json({ error: "Only admins can update the team and project." });
  // }
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        projectName: z.string(),
      }),
    )
    .mutation(async ({ input: { name, projectName, id } }) => {
      const team = await prisma.team.update({
        data: { name, projectName },
        where: { id },
      });

      return team;
    }),

  // Only admins can reset a team
  // if (session?.user.role !== "admin") {
  //   return res.status(401).json({ error: "Only admins can reset a team." });
  // }
  reset: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .mutation(async ({ input: { teamId } }) => {
      const issues = await prisma.issue.deleteMany({ where: { teamId } });
      const users = await prisma.user.updateMany({
        where: { teamId, role: { not: { equals: "admin" } } },
        data: { teamId: null, role: null },
      });

      return { users, issues };
    }),

  // Only admin can remove from team
  remove: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .mutation(async ({ input: { userId } }) => {
      const users = await prisma.user.update({
        where: { id: userId },
        data: { teamId: null, role: null },
      });

      const issues = await prisma.issue.updateMany({
        where: { userId },
        data: { userId: null },
      });

      return { users, issues };
    }),

  invite: protectedProcedure
    .input(
      z.object({
        toEmail: z.string(),
        teamName: z.string(),
        teamId: z.string(),
        windowUrl: z.string(),
      }),
    )
    .mutation(async ({ input: { toEmail, teamName, teamId, windowUrl } }) => {
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
          `http://${windowUrl}/onboarding?teamId=${teamId}`,
      };

      const info = await transporter.sendMail(mailOptions);
      return info;
    }),
});
