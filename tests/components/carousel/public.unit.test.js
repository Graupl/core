/**
 * Public method tests for the Carousel class.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import Carousel from "../../../src/js/carousel/Carousel.js";
import { carouselWithIndicators } from "./fixtures.js";

let carousel;
let onIntersection;
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
      constructor(callback) {
        onIntersection = callback;
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

describe("Carousel public methods", () => {
  describe("activateLastItem", () => {
    it("should scroll to the last slide with the supplied options after removing inert", () => {
      vi.useFakeTimers();
      carousel = new Carousel({
        carouselElement: document.querySelector(".carousel"),
        autoplay: false,
        loop: false,
        initialize: true,
      });
      vi.advanceTimersToNextFrame();
      vi.advanceTimersToNextFrame();
      scrollTo.mockClear();

      const last = carousel.dom.carouselItems[2];
      let inertAtScroll;
      scrollTo.mockImplementation(() => {
        inertAtScroll = last.hasAttribute("inert");
      });

      carousel.activateLastItem({
        scrollOptions: { behavior: "instant", left: 120 },
      });

      expect(carousel.currentItem).toBe(2);
      expect(scrollTo).not.toHaveBeenCalled();

      vi.advanceTimersToNextFrame();

      expect(scrollTo).toHaveBeenCalledExactlyOnceWith({
        left: 120,
        top: 0,
        behavior: "instant",
      });
      expect(inertAtScroll).toBe(false);
    });
  });

  describe("dispose", () => {
    it("should remove loop copies and stop observation, pending scrolls, and autoplay on disposal", () => {
      vi.useFakeTimers();
      const originals = [...document.querySelectorAll(".carousel-item")];
      carousel = new Carousel({
        carouselElement: document.querySelector(".carousel"),
        transitionDelay: 100,
        initialize: true,
      });
      const items = carousel.elements.carouselItems.slice();
      const copy = items[0].dom.carouselItem;
      const next = carousel.dom.next;
      const advance = vi.spyOn(carousel, "activateNextItem");

      onIntersection([{ target: copy, isIntersecting: true }]);

      const activate = vi.spyOn(carousel, "activateItem");

      carousel.dispose();

      next.click();
      onIntersection([{ target: originals[1], isIntersecting: true }]);
      vi.advanceTimersByTime(300);

      expect(carousel.isBootstrapped).toBe(false);
      expect(observer.disconnect).toHaveBeenCalledOnce();
      expect([...document.querySelectorAll(".carousel-item")]).toEqual(
        originals
      );
      expect(items.every((item) => !item.isBootstrapped)).toBe(true);
      expect(scrollTo).not.toHaveBeenCalled();
      expect(advance).not.toHaveBeenCalled();
      expect(activate).not.toHaveBeenCalled();

      carousel = null;
    });
  });
});
