/**
 * Initialization tests for the Carousel class.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import Carousel from "../../../src/js/carousel/Carousel.js";
import { carouselWithIndicators } from "./fixtures.js";

let carousel;
let observer;
let scrollTo;

beforeEach(() => {
  document.body.innerHTML = carouselWithIndicators;
  scrollTo = vi.fn();
  document.querySelector(".carousel-item-container").scrollTo = scrollTo;
  observer = { observe: vi.fn(), disconnect: vi.fn() };
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor() {
        return observer;
      }
    }
  );
});

afterEach(() => {
  carousel?.dispose();
  carousel = null;
  document.body.innerHTML = "";
  delete window.GrauplStorage;
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("Carousel initialization", () => {
  describe("initialize", () => {
    it("should pair each indicator with its slide when initialized", () => {
      vi.useFakeTimers();
      carousel = new Carousel({
        carouselElement: document.querySelector(".carousel"),
        key: "featured",
        autoplay: false,
        loop: false,
      });

      expect(carousel.isBootstrapped).toBe(true);
      expect(carousel.isInitialized).toBe(false);

      carousel.initialize();
      vi.advanceTimersToNextFrame();
      vi.advanceTimersToNextFrame();

      const {
        carousel: root,
        carouselItemContainer,
        carouselTabContainer,
      } = carousel.dom;
      const [first, second, third] = carousel.elements.carouselItems;

      expect(carousel.isInitialized).toBe(true);
      expect(root.id).toBe("carousel-featured");
      expect(root.getAttribute("aria-roledescription")).toBe("carousel");
      expect(carouselItemContainer.tabIndex).toBe(-1);
      expect(carouselTabContainer.getAttribute("role")).toBe("tablist");
      expect(first.dom.carouselItem.id).toBe("first-slide");
      expect(second.dom.carouselItem.id).toBe("carousel-item-featured-1");
      expect(carousel.currentCarouselItem).toBe(first);
      expect(first.dom.carouselItem.hasAttribute("inert")).toBe(false);
      expect(second.dom.carouselItem.hasAttribute("inert")).toBe(true);

      for (const { dom } of [first, second, third]) {
        expect(dom.tab.getAttribute("role")).toBe("tab");
        expect(dom.carouselItem.getAttribute("role")).toBe("tabpanel");
        expect(dom.tab.getAttribute("aria-controls")).toBe(dom.carouselItem.id);
        expect(dom.carouselItem.getAttribute("aria-labelledby")).toBe(
          dom.tab.id
        );
      }

      expect(first.dom.tab.getAttribute("aria-selected")).toBe("true");
      expect(first.dom.tab.tabIndex).toBe(0);
      expect(second.dom.tab.getAttribute("aria-selected")).toBe("false");
      expect(second.dom.tab.tabIndex).toBe(-1);
      expect(observer.observe.mock.calls).toEqual(
        carousel.dom.carouselItems.map((item) => [item])
      );
    });

    it.each(["pauseOnFocus", "resumeOnBlur", "pauseOnEnter", "resumeOnLeave"])(
      "should report a non-boolean %s option and leave the carousel uninitialized",
      (option) => {
        const report = vi.spyOn(console, "error").mockImplementation(() => {});
        carousel = new Carousel({
          carouselElement: document.querySelector(".carousel"),
          [option]: "false",
        });

        carousel.initialize();

        expect(carousel.isInitialized).toBe(false);
        expect(report).toHaveBeenCalledOnce();
        expect(report.mock.calls[0][0].message).toContain(option);
        expect(observer.observe).not.toHaveBeenCalled();
      }
    );
  });
});
