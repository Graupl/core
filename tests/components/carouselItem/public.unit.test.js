/**
 * Public method tests for the CarouselItem class.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import CarouselItem from "../../../src/js/carousel/CarouselItem.js";

let item;
let slide;
let tab;

beforeEach(() => {
  vi.useFakeTimers();
  document.body.innerHTML = `
    <div role="tablist" aria-label="Choose a slide">
      <button type="button" id="slide-tab" role="tab" aria-controls="slide" aria-selected="false">Slide</button>
    </div>
    <div id="slide" role="tabpanel" aria-labelledby="slide-tab" inert>Slide content</div>
  `;
  slide = document.querySelector("#slide");
  tab = document.querySelector("#slide-tab");
});

afterEach(() => {
  item?.dispose();
  item = null;
  document.body.innerHTML = "";
  vi.useRealTimers();
});

describe("CarouselItem public methods", () => {
  describe("activate and deactivate", () => {
    it("should emit lifecycle events in order and update the slide before its tab", () => {
      item = new CarouselItem({
        carouselItemElement: slide,
        tabElement: tab,
        parent: { activeClass: "selected", _registerItemEvents() {} },
        initialize: true,
      });
      const events = [];
      for (const type of [
        "preactivate",
        "activate",
        "postactivate",
        "predeactivate",
        "deactivate",
        "postdeactivate",
      ]) {
        slide.addEventListener(item.getEventName(type), () =>
          events.push(type)
        );
      }

      item.activate({ scroll: false });

      expect(events).toEqual(["preactivate"]);
      expect(slide.hasAttribute("inert")).toBe(true);

      vi.advanceTimersToNextFrame();

      expect(events).toEqual(["preactivate", "activate"]);
      expect(slide.classList.contains("selected")).toBe(true);
      expect(slide.hasAttribute("inert")).toBe(false);
      expect(tab.getAttribute("aria-selected")).toBe("false");

      vi.advanceTimersToNextFrame();

      expect(events).toEqual(["preactivate", "activate", "postactivate"]);
      expect(tab.classList.contains("selected")).toBe(true);
      expect(tab.getAttribute("aria-selected")).toBe("true");

      events.length = 0;

      item.deactivate();

      expect(events).toEqual(["predeactivate"]);

      vi.advanceTimersToNextFrame();

      expect(events).toEqual(["predeactivate", "deactivate"]);
      expect(slide.classList.contains("selected")).toBe(false);
      expect(slide.hasAttribute("inert")).toBe(true);
      expect(tab.getAttribute("aria-selected")).toBe("true");

      vi.advanceTimersToNextFrame();

      expect(events).toEqual(["predeactivate", "deactivate", "postdeactivate"]);
      expect(tab.classList.contains("selected")).toBe(false);
      expect(tab.getAttribute("aria-selected")).toBe("false");
    });

    it("should cancel pending activation when the item deactivates before the next frame", () => {
      item = new CarouselItem({
        carouselItemElement: slide,
        tabElement: tab,
        parent: { activeClass: "selected", _registerItemEvents() {} },
        initialize: true,
      });
      const activate = vi.fn();
      const postactivate = vi.fn();
      const postdeactivate = vi.fn();
      slide.addEventListener(item.getEventName("activate"), activate);
      slide.addEventListener(item.getEventName("postactivate"), postactivate);
      slide.addEventListener(
        item.getEventName("postdeactivate"),
        postdeactivate
      );

      item.activate();
      item.deactivate();
      vi.advanceTimersToNextFrame();
      vi.advanceTimersToNextFrame();

      expect(activate).not.toHaveBeenCalled();
      expect(postactivate).not.toHaveBeenCalled();
      expect(postdeactivate).toHaveBeenCalledOnce();
      expect(slide.hasAttribute("inert")).toBe(true);
      expect(tab.getAttribute("aria-selected")).toBe("false");
    });
  });

  describe("activate", () => {
    it("should update the slide and tab with public activation events disabled", () => {
      item = new CarouselItem({
        carouselItemElement: slide,
        tabElement: tab,
        parent: { activeClass: "selected", _registerItemEvents() {} },
        initialize: true,
      });
      const activate = vi.fn();
      slide.addEventListener(item.getEventName("activate"), activate);

      item.activate({ emit: false });
      vi.advanceTimersToNextFrame();
      vi.advanceTimersToNextFrame();

      expect(activate).not.toHaveBeenCalled();
      expect(slide.hasAttribute("inert")).toBe(false);
      expect(tab.getAttribute("aria-selected")).toBe("true");
    });
  });
});
