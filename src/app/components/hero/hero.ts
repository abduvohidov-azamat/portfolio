import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { PROFILE } from '../../data/portfolio.data';
import { MotionService } from '../../services/motion.service';
import { MagneticDirective } from '../../directives/magnetic.directive';
import { IconComponent } from '../icon/icon';
import { HeroCanvasComponent } from './hero-canvas';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeroCanvasComponent, MagneticDirective, IconComponent],
  templateUrl: './hero.html',
})
export class HeroComponent {
  protected readonly profile = PROFILE;
  protected readonly typed = signal('');

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  protected readonly motion = inject(MotionService);
  private timer?: ReturnType<typeof setTimeout>;
  private ctx?: gsap.Context;

  constructor() {
    effect(() => {
      if (!this.motion.ready()) return;
      untracked(() => {
        this.intro();
        this.typeLoop(0);
      });
    });

    inject(DestroyRef).onDestroy(() => {
      clearTimeout(this.timer);
      this.ctx?.revert();
    });
  }

  protected scrollTo(id: string, event: Event): void {
    event.preventDefault();
    this.motion.scrollTo(`#${id}`);
  }

  private intro(): void {
    const q = gsap.utils.selector(this.host);
    if (this.motion.reducedMotion) {
      gsap.set(q('[data-intro]'), { autoAlpha: 1 });
      return;
    }
    this.ctx = gsap.context(() => {
      const split = SplitText.create(q('.hero-title'), {
        type: 'chars,words',
        mask: 'words',
        wordsClass: 'split-word',
        charsClass: 'split-char',
      });
      gsap.set(q('[data-intro]'), { autoAlpha: 1 });
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from(split.chars, { yPercent: 120, rotate: 8, duration: 1.4, stagger: 0.025 })
        .from(q('.hero-fade'), { y: 30, autoAlpha: 0, duration: 1.2, stagger: 0.1 }, '-=1.1')
        .from(q('app-hero-canvas'), { scale: 0.6, autoAlpha: 0, duration: 2.2 }, 0);

      // Parallax the hero content away as the user scrolls.
      gsap.to(q('.hero-content'), {
        yPercent: 25,
        autoAlpha: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: this.host, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, this.host);
  }

  /** Simple typewriter cycling through the role list. */
  private typeLoop(index: number): void {
    const word = this.profile.roles[index % this.profile.roles.length];
    const schedule = (fn: () => void, ms: number) => (this.timer = setTimeout(fn, ms));
    if (this.motion.reducedMotion) {
      this.typed.set(word);
      return;
    }

    let i = 0;
    const type = () => {
      this.typed.set(word.slice(0, ++i));
      if (i < word.length) schedule(type, 70);
      else schedule(erase, 1800);
    };
    const erase = () => {
      this.typed.set(word.slice(0, --i));
      if (i > 0) schedule(erase, 35);
      else schedule(() => this.typeLoop(index + 1), 300);
    };
    type();
  }
}
