import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { gsap } from 'gsap';

/** Custom dot + trailing ring cursor. Only active on fine pointers. */
@Component({
  selector: 'app-cursor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      #ring
      class="pointer-events-none fixed top-0 left-0 z-[90] -mt-5 -ml-5 hidden size-10 rounded-full border border-white/40 mix-blend-difference [@media(pointer:fine)]:block"
    ></div>
    <div
      #dot
      class="pointer-events-none fixed top-0 left-0 z-[90] -mt-1 -ml-1 hidden size-2 rounded-full bg-white mix-blend-difference [@media(pointer:fine)]:block"
    ></div>
  `,
})
export class CursorComponent {
  private readonly ring = viewChild.required<ElementRef<HTMLElement>>('ring');
  private readonly dot = viewChild.required<ElementRef<HTMLElement>>('dot');

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (!matchMedia('(pointer: fine)').matches) return;
      const ring = this.ring().nativeElement;
      const dot = this.dot().nativeElement;
      const ringX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' });
      const ringY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' });
      const dotX = gsap.quickTo(dot, 'x', { duration: 0.1 });
      const dotY = gsap.quickTo(dot, 'y', { duration: 0.1 });

      const move = (e: PointerEvent) => {
        ringX(e.clientX);
        ringY(e.clientY);
        dotX(e.clientX);
        dotY(e.clientY);
      };
      const over = (e: Event) => {
        const interactive = (e.target as HTMLElement).closest('a, button, input, textarea, [data-cursor]');
        gsap.to(ring, { scale: interactive ? 1.8 : 1, duration: 0.3, ease: 'power2.out' });
        gsap.to(dot, { scale: interactive ? 0 : 1, duration: 0.3 });
      };

      window.addEventListener('pointermove', move);
      document.addEventListener('pointerover', over);
      destroyRef.onDestroy(() => {
        window.removeEventListener('pointermove', move);
        document.removeEventListener('pointerover', over);
      });
    });
  }
}
