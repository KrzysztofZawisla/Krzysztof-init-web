import { FC } from "react";
import { expectType } from "tsd";
import HomePage from "./HomePage";

describe("Home page", () => {
  it("Has correct type", () => {
    expectType<FC>(HomePage);
  });
});
