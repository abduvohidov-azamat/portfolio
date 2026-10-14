import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { NAV_LINKS, PROFILE } from '../../data/portfolio.data';
import { MotionService } from '../../services/motion.service';
import { MagneticDirective } from '../../directives/magnetic.directive';
import { IconComponent } from '../icon/icon';

@Component({
  selector: 'app-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MagneticDirective, IconComponent],
  templateUrl: './nav.html',
})
export class NavComponent {
  protected readonly links = NAV_LINKS;
  protected readonly profile = PROFILE;
  protected readonly active = signal('');
  protected readonly hidden = signal(false);
  protected readonly scrolled = signal(false);
  protected readonly progress = signal(0);
  protected readonly menuOpen = signal(false);

  private readonly motion = inject(MotionService);

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      let lastY = window.scrollY;
      const onScroll = () => {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        this.progress.set(max > 0 ? y / max : 0);
        this.scrolled.set(y > 40);
        this.hidden.set(y > lastY && y > 400 && !this.menuOpen());
        lastY = y;
      };
      window.addEventListener('scroll', onScroll, { passive: true });

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) this.active.set(entry.target.id);
          }
        },
        { rootMargin: '-45% 0px -50% 0px' },
      );
      document.querySelectorAll('section[id]').forEach((s) => observer.observe(s));

      destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
        observer.disconnect();
      });
    });
  }

  protected go(id: string, event?: Event): void {
    event?.preventDefault();
    this.closeMenu();
    this.motion.scrollTo(id === 'top' ? 0 : `#${id}`);
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
    if (this.menuOpen()) {
      this.motion.stop();
    } else {
      this.motion.start();
    }
  }

  private closeMenu(): void {
    if (!this.menuOpen()) return;
    this.menuOpen.set(false);
    this.motion.start();
  }
}
