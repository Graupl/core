import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-vue";
import { variants } from "../defaults.js";
import Component from "./disclosure.js";

// Allow text drift while still detecting an expanded or collapsed panel.
const screenshotOptions = {
  comparatorOptions: {
    allowedMismatchedPixels: 2500,
  },
};

describe("Disclosure Closed Component", () => {
  describe.for(variants)("%s disclosure", async (variant) => {
    it("Should match screenshot while closed:", async () => {
      const screen = render(Component, {
        props: {
          variant,
        },
      });

      await document.fonts.ready;

      await expect(
        screen.getByTestId("component-test-wrapper")
      ).toMatchScreenshot(screenshotOptions);
    });
  });
});

describe("Disclosure Open Component", () => {
  describe.for(variants)("%s disclosure", async (variant) => {
    it("Should match screenshot while open:", async () => {
      const screen = render(Component, {
        props: {
          open: true,
          variant,
        },
      });

      await document.fonts.ready;

      await expect(
        screen.getByTestId("component-test-wrapper")
      ).toMatchScreenshot(screenshotOptions);
    });
  });
});
