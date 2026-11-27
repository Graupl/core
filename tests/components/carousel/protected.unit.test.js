/**
 * Protected method tests for the Carousel class.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import Carousel from "../../../src/js/carousel/Carousel.js";
import {
  carouselWithoutIndicators,
  carouselWithIndicators,
} from "./fixtures.js";

describe("Carousel autoplay interactions", () => {
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

  describe("_handleAutoplay", () => {
    it("should stop autoplay and show Play at the last slide with looping disabled", () => {
      vi.useFakeTimers();
      carousel = new Carousel({
        carouselElement: document.querySelector(".carousel"),
        autoplay: false,
        loop: false,
        transitionDelay: 100,
        initialize: true,
      });
      const { autoplay: control, carousel: root } = carousel.dom;
      const advance = vi.spyOn(carousel, "activateNextItem");

      control.click();

      expect(control.getAttribute("aria-label")).toBe("Pause");

      vi.advanceTimersByTime(100);

      expect(carousel.currentItem).toBe(1);
      expect(carousel.autoplay).toBe(false);
      expect(control.getAttribute("aria-label")).toBe("Play");
      expect(control.classList.contains("play")).toBe(true);
      expect(control.classList.contains("pause")).toBe(false);
      expect(root.getAttribute("aria-live")).toBe("polite");

      vi.advanceTimersByTime(200);

      expect(advance).toHaveBeenCalledOnce();
    });

    it.each([
      ["keep rotation stopped by default", {}, "Play", "polite"],
      ["resume when focus leaves", { resumeOnBlur: true }, "Pause", "off"],
    ])(
      "should %s after a focus pause",
      (_, options, pausedLabel, liveAfterBlur) => {
        carousel = new Carousel({
          carouselElement: document.querySelector(".carousel"),
          ...options,
          initialize: true,
        });
        const {
          autoplay: control,
          carousel: root,
          next,
          previous,
        } = carousel.dom;

        next.focus();

        // Dispatch focusout on its own so a second focusin can't hide an early resume.
        next.dispatchEvent(
          new FocusEvent("focusout", { bubbles: true, relatedTarget: previous })
        );

        expect(root.getAttribute("aria-live")).toBe("polite");
        expect(control.getAttribute("aria-label")).toBe(pausedLabel);

        next.blur();

        expect(root.getAttribute("aria-live")).toBe(liveAfterBlur);
      }
    );

    it.each([
      [
        "focus",
        { pauseOnFocus: false },
        new FocusEvent("focusin", { bubbles: true }),
      ],
      [
        "pointer entry",
        { pauseOnEnter: false },
        new MouseEvent("pointerover", { bubbles: true }),
      ],
    ])(
      "should keep rotating when pausing on %s is disabled",
      (_, options, event) => {
        carousel = new Carousel({
          carouselElement: document.querySelector(".carousel"),
          ...options,
          initialize: true,
        });
        const { carousel: root, next } = carousel.dom;

        next.dispatchEvent(event);

        expect(root.getAttribute("aria-live")).toBe("off");
      }
    );

    it.each([
      ["resume on pointer leave by default", {}, "Pause", "off"],
      [
        "require Play after pointer leave",
        { resumeOnLeave: false },
        "Play",
        "polite",
      ],
    ])("should %s", (_, options, pausedLabel, liveAfterLeave) => {
      carousel = new Carousel({
        carouselElement: document.querySelector(".carousel"),
        ...options,
        initialize: true,
      });
      const { autoplay: control, carousel: root, next } = carousel.dom;

      next.dispatchEvent(new MouseEvent("pointerover", { bubbles: true }));

      expect(root.getAttribute("aria-live")).toBe("polite");
      expect(control.getAttribute("aria-label")).toBe(pausedLabel);

      root.dispatchEvent(new MouseEvent("pointerleave"));

      expect(root.getAttribute("aria-live")).toBe(liveAfterLeave);
    });

    it("should wait for both pauses to clear before resuming automatically", () => {
      carousel = new Carousel({
        carouselElement: document.querySelector(".carousel"),
        resumeOnBlur: true,
        initialize: true,
      });
      const { carousel: root, next } = carousel.dom;

      next.dispatchEvent(new MouseEvent("pointerover", { bubbles: true }));
      next.focus();

      root.dispatchEvent(new MouseEvent("pointerleave"));

      expect(root.getAttribute("aria-live")).toBe("polite");

      next.blur();

      expect(root.getAttribute("aria-live")).toBe("off");
    });

    it("should keep rotation stopped after pressing Pause and leaving the carousel", () => {
      carousel = new Carousel({
        carouselElement: document.querySelector(".carousel"),
        resumeOnBlur: true,
        initialize: true,
      });
      const { autoplay: control, carousel: root } = carousel.dom;

      control.focus();
      control.dispatchEvent(new MouseEvent("pointerover", { bubbles: true }));

      control.click();
      control.blur();
      root.dispatchEvent(new MouseEvent("pointerleave"));

      expect(carousel.autoplay).toBe(false);
      expect(control.getAttribute("aria-label")).toBe("Play");
      expect(root.getAttribute("aria-live")).toBe("polite");
    });
  });
});

describe("Carousel slide observation", () => {
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

  describe("_handleIntersection", () => {
    it("should select an intersecting slide without scrolling to it again", () => {
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

      const [, second] = carousel.dom.carouselItems;

      onIntersection([{ target: second, isIntersecting: false }]);

      expect(carousel.currentItem).toBe(0);

      onIntersection([{ target: second, isIntersecting: true }]);
      vi.advanceTimersToNextFrame();
      vi.advanceTimersToNextFrame();

      expect(carousel.currentItem).toBe(1);
      expect(second.hasAttribute("inert")).toBe(false);
      expect(scrollTo).not.toHaveBeenCalled();
    });

    it("should activate and then scroll to the original slide when a loop copy comes into view", () => {
      vi.useFakeTimers();
      const original = document.querySelector(".carousel-item:last-child");
      carousel = new Carousel({
        carouselElement: document.querySelector(".carousel"),
        autoplay: false,
        initialize: true,
      });

      carousel.activatePreviousItem();
      vi.advanceTimersToNextFrame();
      vi.advanceTimersToNextFrame();
      scrollTo.mockClear();

      const copy = carousel.currentCarouselItem.dom.carouselItem;
      let inertAtScroll;
      scrollTo.mockImplementation(() => {
        inertAtScroll = original.hasAttribute("inert");
      });

      expect(copy.getAttribute("aria-hidden")).toBe("true");
      expect(copy.hasAttribute("inert")).toBe(true);

      onIntersection([{ target: copy, isIntersecting: true }]);

      expect(carousel.currentCarouselItem.dom.carouselItem).toBe(original);
      expect(scrollTo).not.toHaveBeenCalled();

      vi.advanceTimersToNextFrame();

      expect(scrollTo).toHaveBeenCalledExactlyOnceWith({
        left: 0,
        top: 0,
        behavior: "instant",
      });
      expect(inertAtScroll).toBe(false);
    });
  });
});
