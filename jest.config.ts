import { join } from "path";

const config = {
  preset: "ts-jest",
  setupFilesAfterEnv: ["jest-extended", "./src/setupTests.ts"],
  testEnvironment: "jsdom",
  snapshotSerializers: ["@emotion/jest/serializer"],
  moduleNameMapper: {
    "^@root(.*)$": join(__dirname, "src"),
  },
};

export default config;
