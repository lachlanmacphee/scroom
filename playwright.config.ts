import { devices, type PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./e2e",
  globalSetup: "./e2e/setup/global.ts",
  use: {
    ...devices["Desktop Chrome"],
    storageState: "./e2e/setup/storage-state.json",
    baseURL: "http://localhost:3000",
    headless: true,
    ignoreHTTPSErrors: true,
  },
};

export default config;
