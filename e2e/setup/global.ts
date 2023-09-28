import path from "node:path";
import { chromium, type BrowserContext } from "@playwright/test";

import { prisma } from "~/server/db";

type Cookie = Parameters<BrowserContext["addCookies"]>[0][0];
const testCookie: Cookie = {
  name: "next-auth.session-token",
  value: "d52f0c50-b8e3-4326-b48c-4d4a66fdeb64",
  domain: "localhost",
  path: "/",
  expires: -1,
  httpOnly: true,
  secure: false,
  sameSite: "Lax",
};

export default async function globalSetup() {
  const now = new Date();

  await prisma.team.upsert({
    where: {
      id: "octocattestteam",
    },
    create: {
      id: "octocattestteam",
      name: "Octocat's Team",
      projectName: "Octocat's Project",
    },
    update: {},
  });

  await prisma.user.upsert({
    where: {
      email: "octocat@github.com",
    },
    create: {
      name: "Octocat",
      email: "octocat@github.com",
      image: "https://github.com/octocat.png",
      sessions: {
        create: {
          expires: new Date(now.getFullYear(), now.getMonth() + 1, 0),
          sessionToken: testCookie.value,
        },
      },
      accounts: {
        create: {
          type: "oauth",
          provider: "discord",
          providerAccountId: "123456789",
          access_token: "ggg_zZl1pWIvKkf3UDynZ09zLvuyZsm1yC0YoRPt",
          token_type: "bearer",
          scope: "email identify",
        },
      },
      role: "admin",
      teamId: "octocattestteam",
    },
    update: {},
  });

  const storageState = path.resolve(__dirname, "storage-state.json");
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState });
  await context.addCookies([testCookie]);
  await context.storageState({ path: storageState });
  await browser.close();
}
