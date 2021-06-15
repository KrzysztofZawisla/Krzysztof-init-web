describe("Main tests", () => {
  beforeAll(async () => {
    await page.goto("http://localhost:5000");
  });
  it("Has been detected as bot", async () => {
    const webdriver = await page.evaluate(() => {
      return new Promise((resolve) => {
        resolve(window.navigator.webdriver);
      });
    });
    await expect(webdriver).toBe(true);
  });
});

export {};
