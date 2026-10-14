import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PROFILE } from '../../data/portfolio.data';
import { MagneticDirective } from '../../directives/magnetic.directive';
import { RevealDirective } from '../../directives/reveal.directive';
import { IconComponent } from '../icon/icon';
import { SectionHeadingComponent } from '../section-heading/section-heading';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, MagneticDirective, RevealDirective, IconComponent, SectionHeadingComponent],
  templateUrl: './contact.html',
})
export class ContactComponent {
  protected readonly profile = PROFILE;
  protected readonly copied = signal(false);
  protected readonly form = { name: '', email: '', message: '' };

  protected async copyEmail(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.profile.email);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      window.location.href = `mailto:${this.profile.email}`;
    }
  }

  /** No backend needed: opens the visitor's mail client with the message pre-filled. */
  protected send(): void {
    const subject = encodeURIComponent(`Hello from ${this.form.name}`);
    const body = encodeURIComponent(`${this.form.message}\n\n— ${this.form.name} (${this.form.email})`);
    window.location.href = `mailto:${this.profile.email}?subject=${subject}&body=${body}`;
  }
}
