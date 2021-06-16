/* eslint-disable @typescript-eslint/triple-slash-reference */
///<reference path="global.d.ts" />

import { Config } from "@jest/types";
import presetPuppeter from "jest-puppeteer/jest-preset";
import { join } from "path";
import { compilerOptions } from "./tsconfig.json";
import { pathsToModuleNameMapper } from "ts-jest/utils";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  setupFilesAfterEnv: [
    "jest-extended",
    join(__dirname, "src", "setupTests.ts"),
  ],
  snapshotSerializers: ["@emotion/jest/serializer"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: join(__dirname, "src"),
  }),
  testMatch: ["**/*.integration.test.ts"],
  ...presetPuppeter,
};

export default config;
