import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-vue";
import { commands } from "vitest/browser";
import Component from "./tooltip.js";

// Allow small text shifts while still detecting whether the tooltip is shown.
const screenshotOptions = {
  comparatorOptions: {
    allowedMismatchedPixels: 670,
  },
};

describe("Tooltip Component", () => {
  it("Should match screenshot when closed", async () => {
    const screen = render(Component);

    await document.fonts.ready;

    await commands.movePointerAway();

    await expect(
      screen.getByTestId("component-test-wrapper")
    ).toMatchScreenshot(screenshotOptions);
  });

  it("Should match screenshot when open", async () => {
    const screen = render(Component, {
      props: {
        open: true,
      },
    });

    await document.fonts.ready;

    await commands.movePointerAway();

    await expect(
      screen.getByTestId("component-test-wrapper")
    ).toMatchScreenshot(screenshotOptions);
  });
});
