import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-vue";
import { variants as themeVariants, states } from "../defaults.js";
import Component from "./button.js";

// The button component also has a `.link` modifier.
const variants = [...themeVariants, "link"];
const otherStates = states.filter((state) => state !== "focus");

describe("Button Component", () => {
  describe.for(variants)("%s button", (variant) => {
    it("Should match screenshot with state: focus", async () => {
      const screen = render(Component, {
        props: {
          variant,
          state: "focus",
          text: "OK",
        },
      });

      await document.fonts.ready;

      await expect(
        screen.getByRole("button", { name: "OK" })
      ).toMatchScreenshot({
        comparatorOptions: {
          allowedMismatchedPixelRatio: 0.05,
        },
      });
    });

    it.each(otherStates)(
      "Should match screenshot with state: %s",
      async (state) => {
        const screen = render(Component, {
          props: {
            variant,
            state,
          },
        });

        await document.fonts.ready;

        await expect(
          screen.getByTestId("component-test-wrapper")
        ).toMatchScreenshot();
      }
    );
  });

  describe("anchor button", () => {
    it("Should match screenshot when rendered on an anchor element", async () => {
      const screen = render(Component, {
        props: {
          tag: "a",
        },
      });

      await document.fonts.ready;

      await expect(
        screen.getByTestId("component-test-wrapper")
      ).toMatchScreenshot();
    });
  });
});
