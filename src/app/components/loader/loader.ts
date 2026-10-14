import { afterNextRender, ChangeDetectionStrategy, Component, ElementRef, inject, output, signal } from '@angular/core';
import { gsap } from 'gsap';
import { PROFILE } from '../../data/portfolio.data';
import { MotionService } from '../../services/motion.service';

@Component({
  selector: 'app-loader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'fixed inset-0 z-[100] block' },
  template: `
    <div class="loader-bg absolute inset-0 flex flex-col items-center justify-center bg-ink">
      <div class="loader-name overflow-hidden font-display text-sm tracking-[0.4em] text-muted uppercase">
        <span class="inline-block">{{ name }}</span>
      </div>
      <div class="mt-4 font-display text-7xl font-semibold tabular-nums md:text-9xl">
        <span class="text-gradient">{{ progress() }}</span><span class="text-muted">%</span>
      </div>
      <div class="mt-8 h-px w-56 overflow-hidden bg-line">
        <div class="loader-bar h-full origin-left scale-x-0 bg-gradient-to-r from-violet via-cyan to-pink"></div>
      </div>
    </div>
  `,
})
export class LoaderComponent {
  readonly done = output<void>();
  protected readonly progress = signal(0);
  protected readonly name = PROFILE.name;

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const motion = inject(MotionService);

    afterNextRender(() => {
      if (motion.reducedMotion) {
        this.done.emit();
        return;
      }
      const counter = { v: 0 };
      gsap
        .timeline({ onComplete: () => this.done.emit() })
        .from(host.querySelector('.loader-name span'), { yPercent: 100, duration: 0.6, ease: 'power3.out' })
        .to(counter, {
          v: 100,
          duration: 1.6,
          ease: 'power2.inOut',
          onUpdate: () => this.progress.set(Math.round(counter.v)),
        }, 0.1)
        .to(host.querySelector('.loader-bar'), { scaleX: 1, duration: 1.6, ease: 'power2.inOut' }, 0.1)
        .to(host.querySelector('.loader-bg'), {
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.9,
          ease: 'expo.inOut',
        }, '+=0.15');
    });
  }
}
