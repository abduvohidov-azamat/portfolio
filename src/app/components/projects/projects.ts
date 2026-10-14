import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, signal } from '@angular/core';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Project, PROJECTS } from '../../data/portfolio.data';
import { MotionService } from '../../services/motion.service';
import { RevealDirective } from '../../directives/reveal.directive';
import { TiltDirective } from '../../directives/tilt.directive';
import { IconComponent } from '../icon/icon';
import { SectionHeadingComponent } from '../section-heading/section-heading';

gsap.registerPlugin(Flip);

@Component({
  selector: 'app-projects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, TiltDirective, IconComponent, SectionHeadingComponent],
  templateUrl: './projects.html',
})
export class ProjectsComponent {
  protected readonly categories = ['All', ...new Set(PROJECTS.map((p) => p.category))];
  protected readonly filter = signal('All');
  protected readonly visible = computed(() =>
    this.filter() === 'All' ? PROJECTS : PROJECTS.filter((p) => p.category === this.filter()),
  );

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly motion = inject(MotionService);

  protected setFilter(category: string): void {
    if (category === this.filter()) return;
    const cards = this.host.querySelectorAll('[data-flip-id]');
    if (this.motion.reducedMotion || !cards.length) {
      this.filter.set(category);
      return;
    }
    // Animate the grid re-layout with GSAP Flip.
    const state = Flip.getState(cards);
    this.filter.set(category);
    requestAnimationFrame(() => {
      Flip.from(state, {
        targets: this.host.querySelectorAll('[data-flip-id]'),
        duration: 0.7,
        ease: 'power3.inOut',
        absolute: true,
        scale: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.6 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.85, duration: 0.4 }),
        onComplete: () => ScrollTrigger.refresh(),
      });
    });
  }

  protected cover(p: Project): string {
    const [a, b, base] = p.palette;
    return `radial-gradient(circle at 20% 20%, ${a}cc, transparent 55%),
            radial-gradient(circle at 85% 75%, ${b}aa, transparent 50%),
            linear-gradient(135deg, ${base}, #050508)`;
  }
}
