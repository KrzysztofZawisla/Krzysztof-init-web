import { expectType } from "tsd";
import { isMobileGlobal, languageGlobal } from "./globalStore";

describe("Global Store", () => {
  it("isMobileGlobal has correct type", () => {
    expectType<boolean>(isMobileGlobal.get());
  });
  it("languageGlobal has correct type", () => {
    expectType<string>(languageGlobal.get());
  });
  it("languageGlobal has correct length", () => {
    expect(languageGlobal.get().length).toBe(2);
  });
});
