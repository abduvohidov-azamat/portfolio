import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject } from '@angular/core';
import { gsap } from 'gsap';
import { PROFILE } from '../../data/portfolio.data';
import { MotionService } from '../../services/motion.service';
import { RevealDirective } from '../../directives/reveal.directive';
import { TiltDirective } from '../../directives/tilt.directive';
import { IconComponent } from '../icon/icon';
import { SectionHeadingComponent } from '../section-heading/section-heading';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, TiltDirective, IconComponent, SectionHeadingComponent],
  templateUrl: './about.html',
})
export class AboutComponent {
  protected readonly profile = PROFILE;

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const motion = inject(MotionService);
    let ctx: gsap.Context | undefined;

    // Count the stats up from zero when they scroll into view.
    afterNextRender(() => {
      const counters = host.querySelectorAll<HTMLElement>('[data-count]');
      ctx = gsap.context(() => {
        counters.forEach((el) => {
          const target = Number(el.dataset['count']);
          if (motion.reducedMotion) {
            el.textContent = String(target);
            return;
          }
          const obj = { v: 0 };
          gsap.to(obj, {
            v: target,
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            onUpdate: () => (el.textContent = String(Math.round(obj.v))),
          });
        });
      });
    });

    inject(DestroyRef).onDestroy(() => ctx?.revert());
  }
}
