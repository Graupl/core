import { describe, it, expect } from "vitest";
import { h } from "vue";
import { render } from "vitest-browser-vue";
import Component from "./typography.js";

const sizes = [
  `text-xs`,
  `text-sm`,
  `text-base`,
  `text-lg`,
  `text-xl`,
  `text-2xl`,
  `text-3xl`,
  `text-4xl`,
  `text-5xl`,
  `text-h1`,
  `text-h2`,
  `text-h3`,
  `text-h4`,
  `text-h5`,
  `text-h6`,
];

const headings = [`h1`, `h2`, `h3`, `h4`, `h5`, `h6`];

const styles = [`font-normal`, `font-italic`];

const weights = [`font-weight-light`, `font-weight-normal`, `font-weight-bold`];

const transforms = [
  `text-uppercase`,
  `text-lowercase`,
  `text-capitalize`,
  `text-none`,
];

describe("Typography Component", () => {
  it("Should match the screenshot for b and strong:", async () => {
    const screen = render(() =>
      h(
        "p",
        {
          "data-testid": "font",
          style: {
            width: "fit-content",
            fontFamily: "Liberation Sans, sans-serif",
          },
        },
        [
          "Plain text with ",
          h("b", "bold text"),
          " and ",
          h("strong", "strong text"),
        ]
      )
    );

    await document.fonts.ready;

    await expect(screen.getByTestId("font")).toMatchScreenshot();
  });

  it("Should match the screenshots for i and em with the default and overridden styles:", async () => {
    const screen = render(() =>
      h("p", { "data-testid": "font", style: { width: "fit-content" } }, [
        "Plain text with ",
        h("i", "italic text"),
        " and ",
        h("em", "emphasized text"),
      ])
    );

    const paragraph = screen.getByTestId("font");

    await document.fonts.ready;

    await expect(paragraph).toMatchScreenshot();

    paragraph
      .element()
      .style.setProperty("--graupl-italic-font-style", "normal");

    await expect(paragraph).toMatchScreenshot();
  });

  it.each(sizes)("Should match size screenshot with %s:", async (size) => {
    const screen = render(Component, {
      props: {
        attributes: {
          class: [`${size}`],
          "data-testid": "font",
        },
      },
    });

    await document.fonts.ready;

    await expect(screen.getByTestId("font")).toMatchScreenshot();
  });

  it.each(headings)(
    "Should match heading screenshot with %s:",
    async (heading) => {
      const screen = render(Component, {
        props: {
          tag: `${heading}`,
          attributes: {
            "data-testid": "font",
          },
        },
      });

      await document.fonts.ready;

      await expect(screen.getByTestId("font")).toMatchScreenshot();
    }
  );

  it.each(styles)("Should match styles screenshot with %s:", async (style) => {
    const screen = render(Component, {
      props: {
        attributes: {
          class: [`${style}`],
          "data-testid": "font",
        },
      },
    });

    await document.fonts.ready;

    await expect(screen.getByTestId("font")).toMatchScreenshot();
  });

  it.each(weights)(
    "Should match weight screenshot with %s:",
    async (weight) => {
      const screen = render(Component, {
        props: {
          attributes: {
            class: [`${weight}`],
            "data-testid": "font",
          },
        },
      });

      await document.fonts.ready;

      await expect(screen.getByTestId("font")).toMatchScreenshot();
    }
  );

  it.each(transforms)(
    "Should match transform screenshot with %s:",
    async (transform) => {
      const screen = render(Component, {
        props: {
          attributes: {
            class: [`${transform}`],
            "data-testid": "font",
          },
        },
      });

      await document.fonts.ready;

      await expect(screen.getByTestId("font")).toMatchScreenshot();
    }
  );
});
