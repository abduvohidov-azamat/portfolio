import { Directive, ElementRef, inject, input } from '@angular/core';
import { gsap } from 'gsap';

/**
 * 3D tilt that follows the pointer. Also exposes --mx / --my so
 * `.glow-card` can draw a spotlight border under the cursor.
 */
@Directive({
  selector: '[appTilt]',
  host: {
    '(pointermove)': 'onMove($event)',
    '(pointerleave)': 'onLeave()',
    '[style.transformStyle]': '"preserve-3d"',
  },
})
export class TiltDirective {
  /** Maximum rotation in degrees. */
  readonly appTilt = input<number | ''>(8);

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  protected onMove(e: PointerEvent): void {
    const rect = this.el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    this.el.style.setProperty('--mx', `${x * 100}%`);
    this.el.style.setProperty('--my', `${y * 100}%`);
    if (e.pointerType !== 'mouse') return;
    const max = Number(this.appTilt()) || 8;
    gsap.to(this.el, {
      rotateY: (x - 0.5) * max * 2,
      rotateX: (0.5 - y) * max * 2,
      transformPerspective: 900,
      duration: 0.5,
      ease: 'power2.out',
    });
  }

  protected onLeave(): void {
    gsap.to(this.el, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' });
  }
}
