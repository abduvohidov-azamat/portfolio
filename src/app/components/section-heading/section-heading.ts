import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-section-heading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  host: { class: 'block mb-14 md:mb-20' },
  template: `
    <p appReveal class="section-label mb-4 flex items-center gap-3">
      <span class="text-white/40">{{ index() }}</span>
      <span class="h-px w-10 bg-cyan/50"></span>
      {{ label() }}
    </p>
    <h2
      appReveal="split"
      class="max-w-3xl font-display text-[clamp(2.2rem,5.5vw,4.5rem)] leading-[1.02] font-semibold tracking-tight"
    >
      {{ title() }}
      @if (accent()) {
        <span class="text-gradient">{{ accent() }}</span>
      }
    </h2>
  `,
})
export class SectionHeadingComponent {
  readonly index = input.required<string>();
  readonly label = input.required<string>();
  readonly title = input.required<string>();
  readonly accent = input('');
}
