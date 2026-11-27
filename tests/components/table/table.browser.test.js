import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-vue";
import { userEvent } from "vitest/browser";
import { variants } from "../defaults.js";
import Component from "./table.js";

const classes = [
  "bordered",
  "collapsed",
  "hoverable",
  "striped-columns",
  "striped-rows",
];

describe("Table Component", () => {
  describe.for(variants)("%s table", async (variant) => {
    it("Should match screenshot with responsive-table:", async () => {
      const screen = render(Component, {
        props: {
          attributes: {
            class: [variant],
            style: { minWidth: "30rem" },
          },
          wrapperAttributes: {
            class: ["responsive-table"],
            "data-testid": "table-scroll-area",
            style: {
              width: "16rem",
              fontFamily: "Liberation Sans, sans-serif",
            },
          },
        },
      });
      const scrollArea = screen.getByTestId("table-scroll-area");
      const element = scrollArea.element();

      await document.fonts.ready;

      element.scrollLeft = element.scrollWidth - element.clientWidth;

      await expect(scrollArea).toMatchScreenshot();
      expect(element.scrollWidth).toBeGreaterThan(element.clientWidth);
      expect(element.scrollLeft).toBeGreaterThan(0);
    });

    it.each(classes)(
      "Should match screenshot with %s:",
      async (modifierClass) => {
        const screen = render(Component, {
          props: {
            attributes: {
              class: [`${variant}`, `${modifierClass}`],
            },
          },
        });

        await document.fonts.ready;

        const user = userEvent.setup();
        const cell = screen.getByText("JavaScript frameworks");

        await user.hover(cell);

        await expect(
          screen.getByTestId("component-test-wrapper")
        ).toMatchScreenshot();
      }
    );
  });
});
