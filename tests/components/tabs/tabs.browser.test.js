import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-vue";
import { commands } from "vitest/browser";
import Component from "./tabs.js";

describe("Tabs Component", () => {
  it("Should match screenshot", async () => {
    const screen = render(Component);

    await document.fonts.ready;

    await commands.movePointerAway();

    await expect(screen.getByTestId("tabs-frame")).toMatchScreenshot();
  });
});
