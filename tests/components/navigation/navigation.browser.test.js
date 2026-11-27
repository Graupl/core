import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-vue";
import Component from "./navigation.js";

describe("Navigation Component", () => {
  it("Should match screenshot:", async () => {
    const screen = render(Component, {
      props: {
        attributes: { "data-testid": "navigation-row" },
      },
    });

    await document.fonts.ready;

    await expect(screen.getByTestId("navigation-row")).toMatchScreenshot();
  });
});
