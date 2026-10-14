import { Injectable, signal } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Owns smooth scrolling (Lenis) and keeps GSAP's ScrollTrigger in sync with it.
 */
@Injectable({ providedIn: 'root' })
export class MotionService {
  /** Flips to true when the intro loader has finished. */
  readonly ready = signal(false);
  readonly reducedMotion =
    typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  private lenis?: Lenis;

  init(): void {
    if (this.lenis || this.reducedMotion) return;
    this.lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    this.lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => this.lenis?.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  stop(): void {
    this.lenis?.stop();
  }

  start(): void {
    this.lenis?.start();
  }

  scrollTo(target: string | number): void {
    if (this.lenis) {
      this.lenis.scrollTo(target, { offset: typeof target === 'string' ? -72 : 0, duration: 1.4 });
      return;
    }
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
    } else {
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
