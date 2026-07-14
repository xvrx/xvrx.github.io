"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import anime from "animejs";

/*
 * Scroll handoff: scrolling down (wheel or upward swipe) on the home page
 * plays a short exit sequence and navigates to /blog, whose own entrance
 * choreography picks up where this leaves off. OrbitControls zoom is
 * disabled in the scene so the wheel belongs to this.
 */
export default function ScrollToBlog() {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/blog/");
    let acc = 0;
    let lastAt = 0;
    let fired = false;
    let touchY: number | null = null;

    const go = () => {
      if (fired) return;
      fired = true;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        router.push("/blog/");
        return;
      }

      /* the veil rides its own CSS transition over the exit timeline;
         the blog's entrance lifts it again on arrival */
      const veil = document.querySelector<HTMLElement>(".veil");
      if (veil) veil.style.opacity = "1";

      anime
        .timeline({ easing: "easeInOutCubic" })
        .add({
          targets: ".dossier",
          translateY: 80,
          opacity: 0,
          duration: 750,
        })
        .add(
          {
            targets: ".telemetry, .reticle, .scroll-hint",
            opacity: 0,
            duration: 600,
          },
          "-=750"
        )
        .add(
          { targets: ".scene", opacity: 0, scale: 1.03, duration: 700 },
          "-=550"
        );

      setTimeout(() => router.push("/blog/"), 950);
    };

    const onWheel = (e: WheelEvent) => {
      const now = performance.now();
      if (now - lastAt > 600) acc = 0;
      lastAt = now;
      acc += e.deltaY;
      if (acc > 150) go();
    };

    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchY === null) return;
      if (touchY - e.touches[0].clientY > 80) go();
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [router]);

  return (
    <p className="scroll-hint" aria-hidden="true">
      SCROLL <span className="scroll-hint-chevron">▼</span> INDEX OF FILINGS
    </p>
  );
}
