import { join } from "path";
import presetPuppeter from "jest-puppeteer/jest-preset";

const config = {
  preset: "ts-jest",
  setupFilesAfterEnv: [
    "jest-extended",
    join(__dirname, "src", "setupTests.ts"),
  ],
  snapshotSerializers: ["@emotion/jest/serializer"],
  moduleNameMapper: {
    "^@root(.*)$": join(__dirname, "src"),
  },
  testMatch: ["**/*.integration.test.ts"],
  ...presetPuppeter,
};

export default config;
