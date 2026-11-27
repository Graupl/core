/**
 * Click tests for the Carousel class.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import Carousel from "../../../src/js/carousel/Carousel.js";

let carousel;

beforeEach(() => {
  document.body.innerHTML = `
    <section class="carousel" aria-label="Featured slides">
      <div class="carousel-control-container">
        <button type="button" class="carousel-control autoplay">Play</button>
        <button type="button" class="carousel-control previous">Previous</button>
        <button type="button" class="carousel-control next">Next</button>
      </div>
      <div class="carousel-item-container">
        <div class="carousel-item" id="first-slide">First slide</div>
        <div class="carousel-item" id="last-slide">Last slide</div>
      </div>
    </section>
  `;
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

describe("Carousel clicks", () => {
  describe("_handleClick", () => {
    // https://github.com/Graupl/core/issues/9
    it.each([
      ["previous", "next", 0, 1],
      ["next", "previous", 1, 0],
    ])(
      "should keep the boundary slide selected when clicking %s with looping disabled",
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
      "should navigate to the opposite slide's loop copy when clicking %s by default",
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

  it("should stop autoplay and show Play as soon as rotation reaches the last slide", () => {
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
});
