import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const sprintRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        teamId: z.string(),
      }),
    )
    .mutation(async ({ input: {name, startDate, endDate, teamId} }) => {
      const sprint = await prisma.sprint.create({
        data: {teamId, name, startDate: new Date(startDate).toISOString(), endDate: new Date(endDate).toISOString()},
      });
      return sprint;
    }),
    update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        teamId: z.string(),
      }),
    )
    .mutation(async ({ input: {id, name, startDate, endDate, teamId} }) => {
      const sprint = await prisma.sprint.update({
        data: {teamId, name, startDate: new Date(startDate).toISOString(), endDate: new Date(endDate).toISOString()},
        where: {id}
      });
      return sprint;
    }),
});
