import { Directive, ElementRef, inject, input } from '@angular/core';
import { gsap } from 'gsap';

/** Element is gently pulled toward the cursor while hovered. */
@Directive({
  selector: '[appMagnetic]',
  host: {
    '(pointermove)': 'onMove($event)',
    '(pointerleave)': 'onLeave()',
  },
})
export class MagneticDirective {
  /** Pull strength, 0–1. */
  readonly appMagnetic = input<number | ''>(0.35);

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  protected onMove(e: PointerEvent): void {
    if (e.pointerType !== 'mouse') return;
    const rect = this.el.getBoundingClientRect();
    const strength = Number(this.appMagnetic()) || 0.35;
    gsap.to(this.el, {
      x: (e.clientX - rect.left - rect.width / 2) * strength,
      y: (e.clientY - rect.top - rect.height / 2) * strength,
      duration: 0.4,
      ease: 'power3.out',
    });
  }

  protected onLeave(): void {
    gsap.to(this.el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' });
  }
}
