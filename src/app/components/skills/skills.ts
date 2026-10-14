import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MARQUEE, SKILL_GROUPS } from '../../data/portfolio.data';
import { RevealDirective } from '../../directives/reveal.directive';
import { TiltDirective } from '../../directives/tilt.directive';
import { Icon, IconComponent } from '../icon/icon';
import { SectionHeadingComponent } from '../section-heading/section-heading';

const GROUP_ICONS: Icon[] = ['code', 'sparkle', 'server', 'tool'];

@Component({
  selector: 'app-skills',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, TiltDirective, IconComponent, SectionHeadingComponent],
  templateUrl: './skills.html',
})
export class SkillsComponent {
  protected readonly groups = SKILL_GROUPS.map((g, i) => ({ ...g, icon: GROUP_ICONS[i % GROUP_ICONS.length] }));
  // Duplicated so the CSS marquee can loop seamlessly at -50%.
  protected readonly row = [...MARQUEE, ...MARQUEE];
  protected readonly glows = ['bg-violet/30', 'bg-cyan/25', 'bg-pink/25'];
  protected readonly rowReversed = [...MARQUEE].reverse().concat([...MARQUEE].reverse());
}
