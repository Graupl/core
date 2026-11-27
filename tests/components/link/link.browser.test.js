import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-vue";
import { states } from "../defaults.js";
import Component from "./link.js";

const otherStates = states.filter((state) => state !== "focus");

describe("Link Component", () => {
  it("Should match screenshot with state: focus", async () => {
    const screen = render(Component, {
      props: {
        state: "focus",
      },
    });

    await document.fonts.ready;

    await expect(
      screen.getByRole("link", { name: "Click me" })
    ).toMatchScreenshot();
  });

  it.each(otherStates)(
    "Should match screenshot with state: %s",
    async (state) => {
      const screen = render(Component, {
        props: {
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
