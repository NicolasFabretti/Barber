"use client";
import { useEffect } from "react";

export default function ScrollHandler() {
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;

      // Encontra o elemento pai com scroll horizontal
      const scrollableElement = target.closest(
        "[style*='overflow-auto'], [class*='overflow-auto'], [class*='overflow-x']",
      ) as HTMLElement;

      if (
        scrollableElement &&
        scrollableElement.scrollWidth > scrollableElement.clientWidth
      ) {
        // Se o elemento tem scroll horizontal
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          // Se o usuário está usando a roda do mouse (deltaY)
          e.preventDefault();
          scrollableElement.scrollLeft += e.deltaY;
        }
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return null;
}
