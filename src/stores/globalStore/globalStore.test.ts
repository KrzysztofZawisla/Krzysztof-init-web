import { expectType } from "tsd";
import { isMobileGlobal, languageGlobal } from "./globalStore";

describe("Global Store", () => {
  it("isMobileGlobal has correct type", () => {
    expectType<boolean>(isMobileGlobal.get());
  });
  it("languageGlobal has correct type", () => {
    expectType<string>(languageGlobal.get());
  });
});
