import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { gsap } from 'gsap';
import { EXPERIENCE } from '../../data/portfolio.data';
import { RevealDirective } from '../../directives/reveal.directive';
import { MotionService } from '../../services/motion.service';
import { SectionHeadingComponent } from '../section-heading/section-heading';

@Component({
  selector: 'app-experience',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, SectionHeadingComponent],
  templateUrl: './experience.html',
})
export class ExperienceComponent {
  protected readonly items = EXPERIENCE;
  private readonly timeline = viewChild.required<ElementRef<HTMLElement>>('timeline');

  constructor() {
    const motion = inject(MotionService);
    let ctx: gsap.Context | undefined;

    // The glowing line fills in as you scroll through the timeline.
    afterNextRender(() => {
      if (motion.reducedMotion) return;
      const el = this.timeline().nativeElement;
      ctx = gsap.context(() => {
        gsap.fromTo(
          el.querySelector('.timeline-fill'),
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 70%', end: 'bottom 60%', scrub: 0.6 },
          },
        );
        el.querySelectorAll('.timeline-dot').forEach((dot) =>
          gsap.from(dot, {
            scale: 0,
            duration: 0.6,
            ease: 'back.out(3)',
            scrollTrigger: { trigger: dot, start: 'top 70%', once: true },
          }),
        );
      });
    });

    inject(DestroyRef).onDestroy(() => ctx?.revert());
  }
}
