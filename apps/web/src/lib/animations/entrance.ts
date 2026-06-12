import { gsap } from "gsap";

export const prefersReducedMotion = () =>
  typeof matchMedia !== "undefined" &&
  matchMedia("(prefers-reduced-motion: reduce)").matches;

export const motionMs = (ms: number) => (prefersReducedMotion() ? 0 : ms);

export const runEntrance = (root: HTMLElement) => {
  if (prefersReducedMotion()) return;
  const bars = root.querySelectorAll("[data-anim='bar']");
  const panels = root.querySelectorAll("[data-anim='panel']");
  const cards = root.querySelectorAll("[data-anim='card']");
  const tl = gsap.timeline({
    defaults: { ease: "power2.out", duration: 0.45 },
  });
  if (bars.length) {
    tl.from(bars, {
      y: -12,
      opacity: 0,
      stagger: 0.05,
      clearProps: "transform,opacity",
    });
  }
  if (panels.length) {
    tl.from(
      panels,
      { y: 16, opacity: 0, stagger: 0.08, clearProps: "transform,opacity" },
      "-=0.2"
    );
  }
  if (cards.length) {
    tl.from(
      cards,
      { y: 10, opacity: 0, stagger: 0.04, clearProps: "transform,opacity" },
      "-=0.25"
    );
  }
};
