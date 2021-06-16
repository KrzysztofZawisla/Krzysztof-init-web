import { Config } from "@jest/types";
import { join } from "path";
import { compilerOptions } from "./tsconfig.json";
import { pathsToModuleNameMapper } from "ts-jest/utils";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  setupFilesAfterEnv: [
    "jest-extended",
    join(__dirname, "src", "setupTests.ts"),
  ],
  testEnvironment: "jsdom",
  snapshotSerializers: ["@emotion/jest/serializer"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: join(__dirname, "src"),
  }),
  modulePathIgnorePatterns: [join(__dirname, "src", "e2e")],
};

export default config;
