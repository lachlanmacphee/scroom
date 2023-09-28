import { devices, type PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./e2e",
  globalSetup: "./e2e/setup/global.ts",
  timeout: 5000,
  use: {
    ...devices["Desktop Chrome"],
    storageState: "./e2e/setup/storageState.json",
    baseURL: "http://localhost:3000",
    headless: false,
    ignoreHTTPSErrors: true,
  },
};

export default config;
