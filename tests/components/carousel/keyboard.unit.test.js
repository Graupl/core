/**
 * Keyboard tests for the Carousel class.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import Carousel from "../../../src/js/carousel/Carousel.js";
import { carouselWithIndicators } from "./fixtures.js";

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

describe("Carousel keyboard controls", () => {
  it.each([
    ["next", "Enter", 0, 1],
    ["previous", " ", 1, 0],
  ])(
    "should move to the adjacent slide on the %s button with key %j",
    (control, key, start, expected) => {
      carousel = new Carousel({
        carouselElement: document.querySelector(".carousel"),
        autoplay: false,
        loop: false,
        initialize: true,
      });

      carousel.activateItem(start, { scroll: false });

      const button = carousel.dom[control];
      button.focus();

      const keydown = new KeyboardEvent("keydown", {
        key,
        bubbles: true,
        cancelable: true,
      });
      const keyup = new KeyboardEvent("keyup", {
        key,
        bubbles: true,
        cancelable: true,
      });

      button.dispatchEvent(keydown);

      expect(keydown.defaultPrevented).toBe(true);
      expect(carousel.currentItem).toBe(start);

      button.dispatchEvent(keyup);

      expect(keyup.defaultPrevented).toBe(true);
      expect(carousel.currentItem).toBe(expected);
      expect(document.activeElement).toBe(button);
    }
  );

  it("should restart autoplay with Enter and stop it with Space", () => {
    carousel = new Carousel({
      carouselElement: document.querySelector(".carousel"),
      initialize: true,
    });
    const button = carousel.dom.autoplay;

    button.focus();

    expect(button.getAttribute("aria-label")).toBe("Play");

    button.dispatchEvent(
      new KeyboardEvent("keyup", {
        key: "Enter",
        bubbles: true,
        cancelable: true,
      })
    );

    expect(button.getAttribute("aria-label")).toBe("Pause");
    expect(carousel.dom.carousel.getAttribute("aria-live")).toBe("off");

    button.dispatchEvent(
      new KeyboardEvent("keyup", { key: " ", bubbles: true, cancelable: true })
    );

    expect(button.getAttribute("aria-label")).toBe("Play");
    expect(carousel.autoplay).toBe(false);
  });
});

describe("Carousel indicators", () => {
  it.each([
    ["ArrowRight", 1, 2],
    ["ArrowRight", 2, 0],
    ["ArrowLeft", 1, 0],
    ["ArrowLeft", 0, 2],
    ["Home", 1, 0],
    ["End", 1, 2],
  ])(
    "should move focus and activate a slide with %s from index %i",
    (key, start, expected) => {
      carousel = new Carousel({
        carouselElement: document.querySelector(".carousel"),
        autoplay: false,
        loop: false,
        initialize: true,
      });
      const tabs = carousel.dom.carouselTabs;

      tabs[start].focus();

      const keyup = new KeyboardEvent("keyup", {
        key,
        bubbles: true,
        cancelable: true,
      });

      tabs[start].dispatchEvent(keyup);

      expect(keyup.defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(tabs[expected]);
      expect(carousel.currentItem).toBe(expected);
      expect(tabs[expected].tabIndex).toBe(0);
      expect(tabs[start].tabIndex).toBe(-1);
    }
  );

  it("should move focus with ArrowRight and activate the slide with Enter in manual mode", () => {
    vi.useFakeTimers();
    carousel = new Carousel({
      carouselElement: document.querySelector(".carousel"),
      autoplay: false,
      automaticActivation: false,
      loop: false,
      initialize: true,
    });
    const [first, second] = carousel.dom.carouselTabs;

    vi.advanceTimersToNextFrame();
    vi.advanceTimersToNextFrame();
    first.focus();

    first.dispatchEvent(
      new KeyboardEvent("keyup", {
        key: "ArrowRight",
        bubbles: true,
        cancelable: true,
      })
    );

    expect(document.activeElement).toBe(second);
    expect(carousel.currentItem).toBe(0);
    expect(second.getAttribute("aria-selected")).toBe("false");

    second.dispatchEvent(
      new KeyboardEvent("keyup", {
        key: "Enter",
        bubbles: true,
        cancelable: true,
      })
    );
    vi.advanceTimersToNextFrame();
    vi.advanceTimersToNextFrame();

    expect(carousel.currentItem).toBe(1);
    expect(first.getAttribute("aria-selected")).toBe("false");
    expect(second.getAttribute("aria-selected")).toBe("true");
  });
});
