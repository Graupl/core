import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-vue";
import Component from "./accordion.js";

// Allow a small shift in a label while still detecting a swapped panel state.
const screenshotOptions = {
  comparatorOptions: {
    allowedMismatchedPixels: 850,
  },
};

describe("Accordion Closed Component", () => {
  it("Should match screenshot", async () => {
    const screen = render(Component);

    await document.fonts.ready;

    await expect(screen.getByTestId("accordion-frame")).toMatchScreenshot(
      screenshotOptions
    );
  });
});

describe("Accordion Open Component", () => {
  it("Should match screenshot", async () => {
    const screen = render(Component, {
      props: {
        open: true,
      },
    });

    await document.fonts.ready;

    await expect(screen.getByTestId("accordion-frame")).toMatchScreenshot(
      screenshotOptions
    );
  });
});
