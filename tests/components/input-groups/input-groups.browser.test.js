import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-vue";
import { commands } from "vitest/browser";
import Component from "./input-groups.js";

// input-group's layout modifiers - not shared with any other component, so
// kept local rather than in the shared defaults.js fixture.
const modifiers = [
  "default",
  "top",
  "bottom",
  "left",
  "right",
  "inverse",
  "inline",
  "stacked",
];

// Allow small text shifts while preserving the differences between layouts.
const screenshotOptions = {
  comparatorOptions: {
    allowedMismatchedPixelRatio: 0.028,
  },
};

describe("Input Group Component", () => {
  it.each(modifiers)(
    "Should match screenshot with modifier: %s",
    async (modifier) => {
      const screen = render(Component, {
        props: {
          modifier: modifier === "default" ? "" : modifier,
        },
      });

      await document.fonts.ready;

      await commands.movePointerAway();

      await expect(screen.getByTestId("input-group-frame")).toMatchScreenshot(
        screenshotOptions
      );
    }
  );

  describe("select input group", () => {
    it("Should match screenshot", async () => {
      const screen = render(Component, {
        props: {
          modifier: "inline",
          control: "select",
        },
      });

      await document.fonts.ready;

      await commands.movePointerAway();

      await expect(screen.getByTestId("input-group-frame")).toMatchScreenshot(
        screenshotOptions
      );
    });
  });

  describe("checkbox input group", () => {
    it("Should match screenshot", async () => {
      const screen = render(Component, {
        props: {
          control: "checkbox",
        },
      });

      await document.fonts.ready;

      await commands.movePointerAway();

      await expect(screen.getByTestId("input-group-frame")).toMatchScreenshot(
        screenshotOptions
      );
    });
  });
});
