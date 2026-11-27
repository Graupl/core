import { describe, it, expect } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-vue";
import { commands } from "vitest/browser";
import Component from "./card.js";

describe("Card Component", () => {
  it("Should match screenshot", async () => {
    // Keep the full card visible once the image has loaded.
    await page.viewport(1920, 1440);

    const screen = render(Component);
    const image = screen.getByRole("img", { name: "Placeholder image" });

    await document.fonts.ready;

    await image.element().decode();

    await commands.movePointerAway();

    await expect(
      screen.getByTestId("component-test-wrapper")
    ).toMatchScreenshot();
  });
});
