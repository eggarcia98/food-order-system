"use client";

import { useEffect, useRef } from "react";

interface MarqueeProps {
  message?: string;
  items?: string[]; // image URLs
}

export default function Marquee({ message = "", items = [] }: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    // Reset content
    content.innerHTML = "";

    const createTextChunk = () => {
      const span = document.createElement("span");
      span.textContent = message + " \u00A0 • \u00A0 ";
      span.style.display = "inline-block";
      return span;
    };

    const createImageChunk = () => {
      const wrapper = document.createElement("span");
      wrapper.style.display = "inline-flex";
      wrapper.style.alignItems = "center";
      wrapper.style.gap = "1rem";
      for (const src of items) {
        const img = document.createElement("img");
        img.src = src;
        img.alt = "banner";
        img.style.display = "inline-block";
        img.style.height = "auto";
        img.style.maxHeight = "2.25rem";
        wrapper.appendChild(img);
      }
      return wrapper;
    };

    // Choose chunk type
    const baseChunk = items.length > 0 ? createImageChunk() : createTextChunk();
    content.appendChild(baseChunk);

    const ensureEnough = () => {
      while (content.scrollWidth < container.clientWidth * 2) {
        const clone = content.firstElementChild!.cloneNode(true) as HTMLElement;
        content.appendChild(clone);
      }
    };

    ensureEnough();

    let resizeTimer: number | null = null;
    const onResize = () => {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        content.innerHTML = "";
        content.appendChild(baseChunk.cloneNode(true));
        ensureEnough();
      }, 120);
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [message, items]);

  return (
    <div className="marquee" role="region" aria-label="Promotional banner" ref={containerRef}>
      <div className="marquee__content" ref={contentRef} />
    </div>
  );
}
