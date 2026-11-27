import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-vue";
import { commands } from "vitest/browser";
import { variants } from "../defaults.js";
import Component from "./alert.js";

describe("Alert Component", () => {
  describe.for(variants)("%s alert", async (variant) => {
    it("Should match screenshot", async () => {
      const screen = render(Component, {
        props: {
          variant,
        },
      });

      await document.fonts.ready;

      await commands.movePointerAway();

      await expect(
        screen.getByTestId("component-test-wrapper")
      ).toMatchScreenshot();
    });
  });

  it("Should match screenshot of the dismiss button", async () => {
    const screen = render(Component);

    await document.fonts.ready;

    await commands.movePointerAway();

    await expect(screen.getByRole("button", { name: "X" })).toMatchScreenshot({
      comparatorOptions: {
        allowedMismatchedPixels: 6,
      },
    });
  });
});
