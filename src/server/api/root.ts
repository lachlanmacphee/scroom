import { createTRPCRouter } from "~/server/api/trpc";
import { issueRouter } from "./routers/issue";
import { teamRouter } from "./routers/team";
import { userRouter } from "./routers/user";
import { statusRouter } from "./routers/status";
import { dailyScrumRouter } from "./routers/dailyScrum";
import { sprintRouter } from "./routers/sprint";
import { issueCommentRouter } from "./routers/issueComment";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  issue: issueRouter,
  team: teamRouter,
  user: userRouter,
  status: statusRouter,
  dailyScrum: dailyScrumRouter,
  sprint: sprintRouter,
  issueComment: issueCommentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
