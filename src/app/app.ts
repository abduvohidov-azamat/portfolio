import { afterNextRender, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionService } from './services/motion.service';
import { LoaderComponent } from './components/loader/loader';
import { CursorComponent } from './components/cursor/cursor';
import { NavComponent } from './components/nav/nav';
import { HeroComponent } from './components/hero/hero';
import { AboutComponent } from './components/about/about';
import { SkillsComponent } from './components/skills/skills';
import { ExperienceComponent } from './components/experience/experience';
import { ProjectsComponent } from './components/projects/projects';
import { ContactComponent } from './components/contact/contact';
import { FooterComponent } from './components/footer/footer';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LoaderComponent,
    CursorComponent,
    NavComponent,
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    ExperienceComponent,
    ProjectsComponent,
    ContactComponent,
    FooterComponent,
  ],
  templateUrl: './app.html',
})
export class App {
  private readonly motion = inject(MotionService);
  protected readonly loading = signal(true);

  constructor() {
    afterNextRender(() => {
      this.motion.init();
      this.motion.stop();
    });
  }

  protected onLoaded(): void {
    this.loading.set(false);
    this.motion.start();
    this.motion.ready.set(true);
    ScrollTrigger.refresh();
  }
}
