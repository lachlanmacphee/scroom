import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { createTransport } from "nodemailer";
import { env } from "~/env.mjs";
import { TRPCError } from "@trpc/server";
import { defaultColumns } from "~/utils/constants";

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

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);

      const sprint = await prisma.sprint.create({
        data: {
          name: "Sprint 0",
          teamId: team.id,
          startDate,
          endDate,
        },
      });

      for (const column of defaultColumns) {
        await prisma.status.create({
          data: {
            title: column.title,
            value: column.value,
            teamId: team.id,
          },
        });
      }

      return { team, user, sprint };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        projectName: z.string(),
      }),
    )
    .mutation(async ({ input: { name, projectName, id }, ctx }) => {
      if (ctx.session?.user.role !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can update the team and project.",
        });
      }
      const team = await prisma.team.update({
        data: { name, projectName },
        where: { id },
      });

      return team;
    }),

  reset: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .mutation(async ({ input: { teamId }, ctx }) => {
      if (ctx.session?.user.role !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can reset a team.",
        });
      }
      const issues = await prisma.issue.deleteMany({ where: { teamId } });
      const users = await prisma.user.updateMany({
        where: { teamId, role: { not: { equals: "admin" } } },
        data: { teamId: null, role: null },
      });

      return { users, issues };
    }),

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
      }),
    )
    .mutation(async ({ input: { toEmail, teamName, teamId } }) => {
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
        text: `You have been invited to join ${teamName} on scroom! Once you've signed up, click this link https://scroom-xi.vercel.app/onboarding?teamId=${teamId}`,
      };

      const info = await transporter.sendMail(mailOptions);
      return info;
    }),

  delete: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .mutation(async ({ input: { teamId } }) => {
      const issues = await prisma.issue.deleteMany({ where: { teamId } });
      // delete all comments, sprints, status and daily scrums
      const users = await prisma.user.updateMany({
        where: { teamId },
        data: { teamId: null, role: null },
      });
      const team = await prisma.team.delete({ where: { id: teamId } });
      return { users, issues, team };
    }),
});
