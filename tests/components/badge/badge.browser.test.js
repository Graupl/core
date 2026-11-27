import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-vue";
import { commands } from "vitest/browser";
import { variants } from "../defaults.js";
import Component from "./badge.js";

describe("Badge Component", () => {
  describe.for(variants)("%s badge", async (variant) => {
    it("Should match screenshot", async () => {
      const screen = render(Component, {
        props: {
          variant,
        },
      });

      await document.fonts.ready;

      await commands.movePointerAway();

      // Allow small label shifts while still detecting a different palette.
      await expect(
        screen.getByText("Badge", { exact: true })
      ).toMatchScreenshot({
        comparatorOptions: {
          allowedMismatchedPixelRatio: 0.06,
        },
      });
    });
  });
});
