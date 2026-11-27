import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-vue";
import { commands } from "vitest/browser";
import Component from "./columns.js";

const counts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const spans = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// container's sidebars options affect how much width columns has to work
// with, so these are tested together here rather than in isolation.
const sidebarsOptions = ["none", "left", "right", "both"];

describe("Columns Layout", () => {
  it.each(counts)("Should match screenshot with count: %s", async (count) => {
    const screen = render(Component, {
      props: {
        count,
      },
    });

    await document.fonts.ready;

    await commands.movePointerAway();

    await expect(
      screen.getByTestId("component-test-wrapper")
    ).toMatchScreenshot();
  });

  it.each(counts)(
    "Should match screenshot with fixed with count: %s",
    async (count) => {
      const screen = render(Component, {
        props: {
          count,
          fixed: true,
        },
      });

      await document.fonts.ready;

      await commands.movePointerAway();

      await expect(
        screen.getByTestId("component-test-wrapper")
      ).toMatchScreenshot();
    }
  );

  it("Should match screenshot with fixed and fewer items than count", async () => {
    // With only 1 item in a count-3 fixed layout, the item should hold to
    // its calculated 1/3-width column rather than stretching to fill the
    // row - that's the whole point of .fixed, and it's invisible in the
    // "fixed with count" loop above since 12 items always fill the row
    // regardless of fixed/not-fixed.
    const screen = render(Component, {
      props: {
        count: 3,
        fixed: true,
        items: 1,
      },
    });

    await document.fonts.ready;

    await commands.movePointerAway();

    await expect(
      screen.getByTestId("component-test-wrapper")
    ).toMatchScreenshot();
  });

  it.each(spans)("Should match screenshot with span: %s", async (span) => {
    const screen = render(Component, {
      props: {
        span,
        count: 12,
      },
    });

    await document.fonts.ready;

    await commands.movePointerAway();

    await expect(
      screen.getByTestId("component-test-wrapper")
    ).toMatchScreenshot();
  });

  it.each(sidebarsOptions)(
    "Should match screenshot in a container with sidebars: %s",
    async (sidebars) => {
      const screen = render(Component, {
        props: {
          sidebars,
        },
      });

      await document.fonts.ready;

      await commands.movePointerAway();

      await expect(
        screen.getByTestId("component-test-wrapper")
      ).toMatchScreenshot();
    }
  );

  it("Stacks columns without overflow in a narrow container", async () => {
    const screen = render(Component, {
      props: { count: 12, span: 2, items: 3 },
    });
    const container = screen.getByTestId("columns-wrapper").element();
    container.style.inlineSize = "480px";

    const grid = container.querySelector(".columns");
    const items = Array.from(grid.children);
    const rowPositions = new Set(items.map((item) => item.offsetTop));

    expect(rowPositions.size).toBe(3);
    expect(items[0].getBoundingClientRect().width).toBeCloseTo(
      grid.getBoundingClientRect().width
    );
    expect(grid.scrollWidth).toBe(grid.clientWidth);

    await commands.movePointerAway();

    await expect(screen.getByTestId("columns-wrapper")).toMatchScreenshot();
  });

  it("Uses the minimum width inherited from a parent in a fixed grid", async () => {
    const screen = render(Component, {
      props: { count: 3, fixed: true, items: 1 },
    });
    const container = screen.getByTestId("columns-wrapper").element();
    container.style.setProperty("--graupl-content-max-width", "1200px");
    container.style.setProperty("--graupl-columns-min-width", "500px");

    const item = container.querySelector(".columns").firstElementChild;

    expect(item.getBoundingClientRect().width).toBe(500);

    await commands.movePointerAway();

    await expect(screen.getByTestId("columns-wrapper")).toMatchScreenshot();
  });
});

it.each([false, true])(
  "Fits all 11 columns at the content max width with fixed=%s",
  async (fixed) => {
    const screen = render(Component, { props: { count: 11, fixed } });
    const wrapper = screen.getByTestId("component-test-wrapper").element();
    wrapper.style.setProperty("--graupl-content-max-width", "1200px");

    const items = Array.from(wrapper.querySelector(".columns").children);
    const firstRow = items.filter(
      (item) => item.offsetTop === items[0].offsetTop
    );

    expect(firstRow).toHaveLength(11);

    await commands.movePointerAway();

    await expect(screen.getByTestId("columns-wrapper")).toMatchScreenshot();
  }
);
