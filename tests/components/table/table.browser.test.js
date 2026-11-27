import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-vue";
import { userEvent } from "vitest/browser";
import { variants } from "../defaults.js";
import Component, { TableWithRowHeaders } from "./table.js";

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

describe("Table header colours", () => {
  // https://github.com/Graupl/graupl/issues/377
  it("keeps row header colours on striped and hovered rows", async () => {
    const screen = render(TableWithRowHeaders, {
      props: {
        attributes: {
          class: ["striped-rows", "hoverable"],
          style: {
            "--graupl-table-header-background": "#24365b",
            "--graupl-table-header-color": "#ffffff",
            "--graupl-table-striped-background": "#dae9ff",
            "--graupl-table-striped-color": "#16253d",
            "--graupl-table-hover-background": "#ffe4b5",
            "--graupl-table-hover-color": "#402800",
          },
        },
      },
    });
    const table = screen.getByRole("table");
    const hoveredHeader = screen.getByRole("rowheader", { name: "Boots" });

    await document.fonts.ready;
    await userEvent.hover(hoveredHeader);

    await expect(table).toMatchScreenshot();
  });

  // https://github.com/Graupl/graupl/issues/430
  it("uses the header text colour for bold and italic text", async () => {
    const screen = render(TableWithRowHeaders, {
      props: {
        attributes: {
          style: {
            "--graupl-font-color": "#ffd089",
            "--graupl-table-header-background": "#24365b",
            "--graupl-table-header-color": "#ffffff",
          },
        },
      },
    });
    const header = screen.getByRole("columnheader", {
      name: "Stock available today",
    });

    await document.fonts.ready;

    await expect(header).toMatchScreenshot();
  });
});
