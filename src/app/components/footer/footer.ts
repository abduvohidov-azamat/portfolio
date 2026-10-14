import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PROFILE } from '../../data/portfolio.data';
import { MagneticDirective } from '../../directives/magnetic.directive';
import { MotionService } from '../../services/motion.service';
import { IconComponent } from '../icon/icon';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MagneticDirective, IconComponent],
  template: `
    <footer class="border-t border-line">
      <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 sm:flex-row">
        <p class="text-sm text-muted">
          © {{ year }} {{ name }}. Built with <span class="text-white/80">Angular</span>,
          <span class="text-white/80">GSAP</span> &amp; <span class="text-white/80">Three.js</span>.
        </p>
        <button
          type="button"
          appMagnetic
          (click)="toTop()"
          class="group flex items-center gap-3 text-sm text-muted transition-colors hover:text-white"
        >
          Back to top
          <span class="grid size-10 place-items-center rounded-full border border-line transition-colors group-hover:border-white/40">
            <app-icon name="arrowUp" [size]="16" />
          </span>
        </button>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  protected readonly year = new Date().getFullYear();
  protected readonly name = PROFILE.name;
  private readonly motion = inject(MotionService);

  protected toTop(): void {
    this.motion.scrollTo(0);
  }
}
