import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const userRouter = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        role: z.string().optional(),
      }),
    )
    .mutation(async ({ input: { id, role }, ctx }) => {
      if (ctx.session?.user.role !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can update roles.",
        });
      }
      const user = await prisma.user.update({ data: { role }, where: { id } });
      return user;
    }),

  joinTeam: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        userId: z.string(),
        role: z.string(),
      }),
    )
    .mutation(async ({ input: { teamId, role, userId } }) => {
      const data = { teamId, role };
      const user = await prisma.user.update({ data, where: { id: userId } });
      return user;
    }),
});
