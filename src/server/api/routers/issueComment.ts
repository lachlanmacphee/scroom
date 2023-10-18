import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const issueCommentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        dateCreated: z.string(),
        issueId: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const issueComment = await prisma.issueComment.create({
        data: input,
      });
      return issueComment;
    }),
  get: protectedProcedure
    .input(
      z.object({
        issueId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const issueComments = await prisma.issueComment.findMany({
        where: {
          issueId: input.issueId,
        },
      });
      return issueComments;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const issueComment = await prisma.issueComment.delete({
        where: { id: input.id },
      });
      return issueComment;
    }),
});
