import { afterNextRender, DestroyRef, Directive, ElementRef, inject, input } from '@angular/core';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { MotionService } from '../services/motion.service';

type RevealMode = '' | 'up' | 'stagger' | 'split';

/**
 * Scroll-triggered entrance animation.
 *  - `appReveal` / `appReveal="up"`: element fades and slides up
 *  - `appReveal="stagger"`: direct children animate in one after another
 *  - `appReveal="split"`: text is split into words that rise from a mask
 */
@Directive({ selector: '[appReveal]' })
export class RevealDirective {
  readonly appReveal = input<RevealMode>('');
  readonly revealDelay = input(0);

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const motion = inject(MotionService);
    let ctx: gsap.Context | undefined;

    afterNextRender(() => {
      if (motion.reducedMotion) return;
      const delay = this.revealDelay();
      const scrollTrigger = { trigger: el, start: 'top 85%', once: true };

      ctx = gsap.context(() => {
        switch (this.appReveal()) {
          case 'stagger':
            gsap.from(el.children, {
              y: 50,
              opacity: 0,
              duration: 1,
              ease: 'power3.out',
              stagger: 0.12,
              delay,
              scrollTrigger,
            });
            break;
          case 'split':
            SplitText.create(el, {
              type: 'words',
              mask: 'words',
              wordsClass: 'split-word',
              autoSplit: true,
              onSplit: (self) =>
                gsap.from(self.words, {
                  yPercent: 110,
                  duration: 1.1,
                  ease: 'expo.out',
                  stagger: 0.06,
                  delay,
                  scrollTrigger,
                }),
            });
            break;
          default:
            gsap.from(el, { y: 60, opacity: 0, duration: 1.1, ease: 'power3.out', delay, scrollTrigger });
        }
      });
    });

    inject(DestroyRef).onDestroy(() => ctx?.revert());
  }
}
