import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const issueRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        status: z.string(),
        summary: z.string(),
        backlog: z.string(),
        userId: z.string(),
        type: z.string(),
        estimate: z.string(),
        teamId: z.string(),
        sprintId: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const issue = await prisma.issue.create({
        data: {
          ...input,
          dateCompleted:
            input.status === "done" ? new Date().toISOString() : null,
        },
      });
      return issue;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.string().optional(),
        summary: z.string().optional(),
        backlog: z.string().optional(),
        userId: z.string().optional(),
        type: z.string().optional(),
        estimate: z.string().optional(),
        teamId: z.string(),
        sprintId: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const issue = await prisma.issue.update({
        data: {
          ...input,
          dateCompleted:
            input.status === "done" ? new Date().toISOString() : null,
        },
        where: { id: input.id, teamId: input.teamId },
      });
      return issue;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const issue = await prisma.issue.delete({ where: { id: input.id } });
      return issue;
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const issue = await prisma.issue.update({
        data: input,
        where: { id: input.id },
      });
      return issue;
    }),
});
