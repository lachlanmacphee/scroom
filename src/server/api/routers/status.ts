
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";


export const statusRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        value: z.string(),
        title: z.string(),
        teamId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const status = await prisma.status.create({
        data: input,
      });
      return status;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),

      }),
    )
    .mutation(async ({ input }) => {
      const status = await prisma.status.update({
        data: input,
        where: { id: input.id },
      });
      return status;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const status = await prisma.status.delete({ where: { id: input.id } });
      return status;
    }),
});