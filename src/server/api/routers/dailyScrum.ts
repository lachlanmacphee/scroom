import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const dailyScrumRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        yesterday: z.string(),
        today: z.string(),
        blockers: z.string(),
        datePosted: z.string(),
        userId: z.string(),
        teamId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const dailyScrum = await prisma.dailyScrum.create({
        data: input,
      });
      return dailyScrum;
    }),

  get: protectedProcedure
    .input(
      z.object({
        datePosted: z.string(),
        teamId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const dailyScrums = await prisma.dailyScrum.findMany({
        where: {
          datePosted: input.datePosted,
          teamId: input.teamId
        },
      });
      return dailyScrums;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        yesterday: z.string(),
        today: z.string(),
        blockers: z.string(),
        datePosted: z.string(),
        userId: z.string(),
        teamId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const dailyScrum = await prisma.dailyScrum.update({
        data: input,
        where: { id: input.id, teamId: input.teamId },
      });
      return dailyScrum;
    }),
});
