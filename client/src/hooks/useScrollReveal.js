import { useEffect } from "react";

/**
 * Custom hook that uses IntersectionObserver to add the `.revealed` class
 * when elements enter the viewport. Respects prefers-reduced-motion.
 *
 * @param {React.RefObject|Array} [scopeRefOrDeps] - Optional ref to limit search scope, or dependency array.
 * @param {Array} [optionalDeps] - Dependency array if scopeRef is provided.
 */
export function useScrollReveal(scopeRefOrDeps, optionalDeps = []) {
  useEffect(() => {
    let root = document;

    if (scopeRefOrDeps && typeof scopeRefOrDeps === "object" && "current" in scopeRefOrDeps) {
      root = scopeRefOrDeps.current || document;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const selectors =
      ".scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, .scroll-reveal-fade, .scroll-reveal-slide-up, [data-scroll-reveal]";

    const elements = root.querySelectorAll(selectors);
    if (!elements.length) return;

    if (reduceMotion) {
      elements.forEach((el) => {
        el.classList.add("revealed");
        el.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, Array.isArray(scopeRefOrDeps) ? scopeRefOrDeps : optionalDeps);
}

export default useScrollReveal;
