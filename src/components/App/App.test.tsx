import { FC } from "react";
import { expectType } from "tsd";
import App from "./App";

describe("App", () => {
  it("Has correct type", () => {
    expectType<FC>(App);
  });
});
