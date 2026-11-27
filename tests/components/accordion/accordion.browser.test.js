import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-vue";
import { commands } from "vitest/browser";
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

    const frame = screen.getByTestId("accordion-frame");

    await document.fonts.ready;
    await commands.movePointerAway();

    await expect(frame).toMatchScreenshot(screenshotOptions);
  });
});

describe("Accordion Open Component", () => {
  it("Should match screenshot", async () => {
    const screen = render(Component, {
      props: {
        open: true,
      },
    });

    const frame = screen.getByTestId("accordion-frame");

    await document.fonts.ready;
    await commands.movePointerAway();

    await expect(frame).toMatchScreenshot(screenshotOptions);
  });
});
