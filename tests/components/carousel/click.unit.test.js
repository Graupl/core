/**
 * Click tests for the Carousel class.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import Carousel from "../../../src/js/carousel/Carousel.js";
import {
  carouselWithoutIndicators,
  carouselWithIndicators,
} from "./fixtures.js";

describe("Carousel clicks", () => {
  describe("_handleClick", () => {
    describe("without indicators", () => {
      let carousel;

      beforeEach(() => {
        document.body.innerHTML = carouselWithoutIndicators;
        document.querySelector(".carousel-item-container").scrollTo = vi.fn();
        vi.stubGlobal(
          "IntersectionObserver",
          class {
            observe() {}
            disconnect() {}
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

      // https://github.com/Graupl/core/issues/9
      it.each([
        ["previous", "next", 0, 1],
        ["next", "previous", 1, 0],
      ])(
        "should ignore %s clicks that would move past either end with looping disabled",
        (outward, inward, boundary, otherSlide) => {
          carousel = new Carousel({
            carouselElement: document.querySelector(".carousel"),
            autoplay: false,
            loop: false,
            initialize: true,
          });
          carousel.activateItem(boundary, { scroll: false });
          const activateItem = vi.spyOn(carousel, "activateItem");

          carousel.dom[outward].click();

          expect(carousel.currentItem).toBe(boundary);
          expect(activateItem).not.toHaveBeenCalled();

          carousel.dom[inward].click();

          expect(carousel.currentItem).toBe(otherSlide);
        }
      );

      it.each([
        ["previous", 1, "#last-slide"],
        ["next", 2, "#first-slide"],
      ])(
        "should select the opposite slide's loop copy when clicking %s by default",
        (control, boundary, oppositeSlide) => {
          carousel = new Carousel({
            carouselElement: document.querySelector(".carousel"),
            autoplay: false,
            initialize: true,
          });
          carousel.activateItem(boundary, { scroll: false });

          carousel.dom[control].click();

          expect(
            carousel.currentCarouselItem.elements.clone?.dom.carouselItem
          ).toBe(document.querySelector(oppositeSlide));
        }
      );
    });

    describe("with indicators", () => {
      let carousel;

      beforeEach(() => {
        document.body.innerHTML = carouselWithIndicators;
        document.querySelector(".carousel-item-container").scrollTo = vi.fn();
        vi.stubGlobal(
          "IntersectionObserver",
          class {
            observe() {}
            disconnect() {}
          }
        );
      });

      afterEach(() => {
        carousel?.dispose();
        carousel = null;
        document.body.innerHTML = "";
        delete window.GrauplStorage;
        vi.unstubAllGlobals();
        vi.useRealTimers();
      });

      it("should select the clicked indicator and make it the tab stop when focus is outside the tablist", () => {
        vi.useFakeTimers();
        carousel = new Carousel({
          carouselElement: document.querySelector(".carousel"),
          autoplay: false,
          loop: false,
          initialize: true,
        });
        const [first, , last] = carousel.dom.carouselTabs;

        last.click();
        vi.advanceTimersToNextFrame();
        vi.advanceTimersToNextFrame();

        expect(carousel.currentItem).toBe(2);
        expect(first.tabIndex).toBe(-1);
        expect(last.tabIndex).toBe(0);
        expect(last.getAttribute("aria-selected")).toBe("true");
      });
    });
  });
});
