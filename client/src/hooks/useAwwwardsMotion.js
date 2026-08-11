import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useAwwwardsMotion(scopeRef, deps = []) {
  // 1. Entrance Animations (Run once on mount)
  useEffect(() => {
    const root = scopeRef?.current;
    if (!root) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;

    const ctx = gsap.context(() => {
      gsap.from("[data-hero-reveal]", {
        y: 16,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.08,
      });

      gsap.utils.toArray("[data-reveal]").forEach((item) => {
        gsap.from(item, {
          y: 34,
          opacity: 0,
          duration: 0.72,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 86%",
            once: true,
          },
        });
      });

      gsap.utils.toArray("[data-reveal-group]").forEach((group) => {
        gsap.from(group.children, {
          y: 30,
          opacity: 0,
          duration: 0.62,
          ease: "power2.out",
          stagger: 0.07,
          scrollTrigger: {
            trigger: group,
            start: "top 84%",
            once: true,
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [scopeRef]);

  // 2. Interactive Listeners (Re-bind when deps change)
  useEffect(() => {
    const root = scopeRef?.current;
    if (!root) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;

    const cleanups = [];
    const ctx = gsap.context(() => {
      gsap.utils.toArray("[data-tilt]").forEach((card) => {
        const rotateX = gsap.quickTo(card, "rotationX", { duration: 0.35, ease: "power3.out" });
        const rotateY = gsap.quickTo(card, "rotationY", { duration: 0.35, ease: "power3.out" });
        const lift = gsap.quickTo(card, "y", { duration: 0.28, ease: "power3.out" });

        const onMove = (event) => {
          const rect = card.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width - 0.5;
          const py = (event.clientY - rect.top) / rect.height - 0.5;
          rotateX(py * -7);
          rotateY(px * 8);
          lift(-6);
        };

        const onLeave = () => {
          rotateX(0);
          rotateY(0);
          lift(0);
        };

        card.addEventListener("pointermove", onMove);
        card.addEventListener("pointerleave", onLeave);
        cleanups.push(() => {
          card.removeEventListener("pointermove", onMove);
          card.removeEventListener("pointerleave", onLeave);
        });
      });

      gsap.utils.toArray("[data-magnetic]").forEach((item) => {
        const moveX = gsap.quickTo(item, "x", { duration: 0.35, ease: "power3.out" });
        const moveY = gsap.quickTo(item, "y", { duration: 0.35, ease: "power3.out" });

        const onMove = (event) => {
          const rect = item.getBoundingClientRect();
          moveX((event.clientX - rect.left - rect.width / 2) * 0.2);
          moveY((event.clientY - rect.top - rect.height / 2) * 0.24);
        };

        const onLeave = () => {
          moveX(0);
          moveY(0);
        };

        item.addEventListener("pointermove", onMove);
        item.addEventListener("pointerleave", onLeave);
        cleanups.push(() => {
          item.removeEventListener("pointermove", onMove);
          item.removeEventListener("pointerleave", onLeave);
        });
      });

      gsap.utils.toArray("[data-glow]").forEach((el) => {
        const onMove = (event) => {
          const rect = el.getBoundingClientRect();
          el.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
          el.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
        };
        el.addEventListener("pointermove", onMove);
        cleanups.push(() => el.removeEventListener("pointermove", onMove));
      });
    }, root);

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, deps);
}
