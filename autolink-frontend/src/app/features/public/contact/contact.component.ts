import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgxCaptchaModule } from 'ngx-captcha';
import { ContactoService } from '../../../core/services/contacto.service';
import { NotificationService } from '../../../core/services/notification.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxCaptchaModule],
  template: `
    <div class="min-h-screen bg-surface-base text-content-primary py-20 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="grid md:grid-cols-2 gap-12">
          
          <!-- Contact Info -->
          <div class="space-y-8">
            <header class="space-y-4">
              <h1 class="text-4xl font-black tracking-tight text-content-primary italic">Contáctanos</h1>
              <p class="text-content-secondary text-lg">¿Tienes alguna duda o sugerencia? Estamos aquí para ayudarte a encontrar tu próximo vehículo.</p>
            </header>

            <div class="space-y-6">
              <div class="flex items-start gap-4 p-6 bg-surface-card rounded-2xl border border-white/5 backdrop-blur-sm">
                <div class="w-12 h-12 bg-action-primary/10 rounded-xl flex items-center justify-center text-action-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </div>
                <div>
                  <h3 class="font-bold text-content-primary">Email</h3>
                  <p class="text-content-secondary">speicon1911@g.educaand.es</p>
                </div>
              </div>

              <div class="flex items-start gap-4 p-6 bg-surface-card rounded-2xl border border-white/5 backdrop-blur-sm">
                <div class="w-12 h-12 bg-action-primary/10 rounded-xl flex items-center justify-center text-action-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div>
                  <h3 class="font-bold text-content-primary">Teléfono</h3>
                  <p class="text-content-secondary">+34 900 000 000</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="bg-surface-card p-8 rounded-3xl border border-white/5 backdrop-blur-md shadow-2xl">
            <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <div class="space-y-2">
                <label class="text-sm font-bold uppercase tracking-wider text-content-muted">Nombre</label>
                <input 
                  formControlName="name"
                  type="text" 
                  class="w-full bg-surface-base/50 border border-white/10 rounded-xl px-4 py-3 text-content-primary focus:border-action-primary focus:ring-1 focus:ring-action-primary outline-none transition-all placeholder:text-content-muted/20"
                  placeholder="Tu nombre completo">
              </div>

              <div class="space-y-2">
                <label class="text-sm font-bold uppercase tracking-wider text-content-muted">Email</label>
                <input 
                  formControlName="email"
                  type="email" 
                  class="w-full bg-surface-base/50 border border-white/10 rounded-xl px-4 py-3 text-content-primary focus:border-action-primary focus:ring-1 focus:ring-action-primary outline-none transition-all placeholder:text-content-muted/20"
                  placeholder="tu@email.com">
              </div>

              <div class="space-y-2">
                <label class="text-sm font-bold uppercase tracking-wider text-content-muted">Mensaje</label>
                <textarea 
                  formControlName="message"
                  rows="4" 
                  class="w-full bg-surface-base/50 border border-white/10 rounded-xl px-4 py-3 text-content-primary focus:border-action-primary focus:ring-1 focus:ring-action-primary outline-none transition-all resize-none placeholder:text-content-muted/20"
                  placeholder="¿En qué podemos ayudarte?"></textarea>
              </div>

              <!-- Google reCAPTCHA v2 Checkbox -->
              <div class="flex justify-center my-4">
                <ngx-recaptcha2
                  [siteKey]="recaptchaSiteKey"
                  [theme]="'dark'"
                  (success)="recaptchaToken.set($event)"
                  (expire)="recaptchaToken.set(null)">
                </ngx-recaptcha2>
              </div>

              <button 
                type="submit"
                [disabled]="contactForm.invalid || isSubmitting || !recaptchaToken()"
                class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed text-surface-base font-black py-4 rounded-xl transition-all shadow-lg shadow-action-primary/20 active:scale-95 uppercase tracking-widest flex items-center justify-center gap-2">
                @if (isSubmitting) {
                  <div class="w-5 h-5 border-2 border-surface-base/20 border-t-surface-base rounded-full animate-spin"></div>
                }
                {{ isSubmitting ? 'Enviando...' : 'Enviar Mensaje' }}
              </button>

              <div *ngIf="submitted" class="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-center animate-pulse font-bold">
                ¡Gracias! Tu mensaje ha sido enviado con éxito.
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  `
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private contactoService = inject(ContactoService);
  private ns = inject(NotificationService);

  readonly recaptchaSiteKey = environment.recaptchaSiteKey;
  recaptchaToken = signal<string | null>(null);
  
  contactForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  isSubmitting = false;
  submitted = false;

  onSubmit() {
    if (this.contactForm.valid && this.recaptchaToken()) {
      this.isSubmitting = true;
      
      const contactoDTO = {
        nombre: this.contactForm.value.name!,
        email: this.contactForm.value.email!,
        asunto: 'Consulta desde Autolink',
        mensaje: this.contactForm.value.message!,
        recaptchaToken: this.recaptchaToken()!
      };

      this.contactoService.enviarMensaje(contactoDTO).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.submitted = true;
          this.contactForm.reset();
          this.recaptchaToken.set(null);
          this.ns.success('Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.');
          
          setTimeout(() => this.submitted = false, 5000);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.recaptchaToken.set(null);
          const errorMsg = err.error?.message || 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.';
          this.ns.error(errorMsg);
        }
      });
    }
  }
}
