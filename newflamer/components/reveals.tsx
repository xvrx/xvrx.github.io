"use client";

import { useEffect } from "react";
import anime from "animejs";

/*
 * Entrance choreography. Every component renders nothing — each runs one
 * anime.js timeline against the page's existing markup on mount.
 *
 * Elements start hidden only when <html class="js"> is set (inline script
 * in the layout), so the site is fully visible without JavaScript. Under
 * prefers-reduced-motion the timelines never run and a CSS override keeps
 * everything visible.
 *
 * Easing is deliberately soft everywhere: a long-tailed deceleration
 * curve rather than expo snaps.
 */

const SOFT = "cubicBezier(0.22, 1, 0.36, 1)";

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* Home — target acquisition: brackets drift in and settle on the subject,
   the label surfaces, the dossier rises, telemetry comes online. */
export function HomeIntro() {
  useEffect(() => {
    if (reducedMotion()) return;

    const tl = anime.timeline({ easing: SOFT });

    tl.add({
      targets: ".scene",
      opacity: [0, 1],
      duration: 1400,
      easing: "easeInOutSine",
    })
      .add(
        {
          targets: ".reticle-bracket.tl",
          translateX: [-52, 0],
          translateY: [-52, 0],
          opacity: [0, 0.9],
          duration: 1400,
        },
        "-=1000"
      )
      .add(
        {
          targets: ".reticle-bracket.tr",
          translateX: [52, 0],
          translateY: [-52, 0],
          opacity: [0, 0.9],
          duration: 1400,
        },
        "-=1400"
      )
      .add(
        {
          targets: ".reticle-bracket.bl",
          translateX: [-52, 0],
          translateY: [52, 0],
          opacity: [0, 0.9],
          duration: 1400,
        },
        "-=1400"
      )
      .add(
        {
          targets: ".reticle-bracket.br",
          translateX: [52, 0],
          translateY: [52, 0],
          opacity: [0, 0.9],
          duration: 1400,
        },
        "-=1400"
      )
      .add(
        {
          /* centered via the CSS `translate` property, so only transform-Y here */
          targets: ".reticle-label",
          opacity: [0, 1],
          translateY: [10, 0],
          duration: 900,
        },
        "-=800"
      )
      .add(
        {
          /* h1 and .dossier-body are excluded — their entrance IS the
             typewriter effect, which must play fully visible */
          targets: ".dossier > *:not(h1):not(.dossier-body)",
          translateY: [36, 0],
          opacity: [0, 1],
          duration: 1200,
          delay: anime.stagger(130),
        },
        "-=1100"
      )
      .add(
        {
          /* animated as a block — its spans are re-rendered by live telemetry */
          targets: ".telemetry",
          translateX: [20, 0],
          opacity: [0, 1],
          duration: 1000,
        },
        "-=1000"
      )
      .add(
        {
          targets: ".scroll-hint",
          translateY: [12, 0],
          opacity: [0, 1],
          duration: 1000,
        },
        "-=650"
      );

    return () => tl.pause();
  }, []);

  return null;
}

/* Blog index — the ledger eases its rows out one by one. */
export function IndexReveal() {
  useEffect(() => {
    if (reducedMotion()) return;

    const tl = anime.timeline({ easing: SOFT });

    tl.add({
      /* .index-sub is excluded — it enters by typing itself out */
      targets: ".index-header > *:not(.index-sub)",
      translateY: [24, 0],
      opacity: [0, 1],
      duration: 1000,
      delay: anime.stagger(120),
    }).add(
      {
        targets: ".cat-label, .filings li",
        translateY: [34, 0],
        opacity: [0, 1],
        duration: 1100,
        delay: anime.stagger(120),
      },
      "-=700"
    );

    return () => tl.pause();
  }, []);

  return null;
}

/* Post — one quiet fade-up: header, then the document itself. */
export function PostReveal() {
  useEffect(() => {
    if (reducedMotion()) return;

    const tl = anime.timeline({ easing: SOFT });

    tl.add({
      targets: ".post-topbar, .post-header > *",
      translateY: [22, 0],
      opacity: [0, 1],
      duration: 1000,
      delay: anime.stagger(130),
    }).add(
      {
        targets: ".markdown, .post-return",
        translateY: [28, 0],
        opacity: [0, 1],
        duration: 1200,
        delay: anime.stagger(160),
      },
      "-=600"
    );

    return () => tl.pause();
  }, []);

  return null;
}
