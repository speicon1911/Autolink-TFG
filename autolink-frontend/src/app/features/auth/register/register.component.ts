import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgxCaptchaModule } from 'ngx-captcha';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Rol } from '../../../core/models/user.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NgxCaptchaModule],
  template: `
    <div class="max-w-md mx-auto mt-8 mb-12 animate-fade-in px-4">
      <div class="bg-surface-card/80 backdrop-blur-xl p-8 rounded-3xl border border-action-primary/20 shadow-2xl space-y-8">
        <header class="text-center space-y-2">
          <h1 class="text-3xl font-black text-content-primary">Únete a AutoLink</h1>
          <p class="text-content-secondary">Crea tu cuenta en segundos</p>
        </header>
    
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold uppercase tracking-widest text-action-primary ml-1">Nombre</label>
              <input type="text" formControlName="nombre"
                class="w-full bg-surface-base/10 border border-white/10 rounded-xl px-4 py-2.5 text-content-primary focus:ring-2 focus:ring-action-primary outline-none transition-all placeholder:text-content-muted/30"
                placeholder="Juan">
            </div>
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold uppercase tracking-widest text-action-primary ml-1">Apellidos</label>
              <input type="text" formControlName="apellidos"
                class="w-full bg-surface-base/10 border border-white/10 rounded-xl px-4 py-2.5 text-content-primary focus:ring-2 focus:ring-action-primary outline-none transition-all placeholder:text-content-muted/30"
                placeholder="Pérez">
            </div>
          </div>
    
          <div class="space-y-1.5">
            <label class="text-[10px] font-bold uppercase tracking-widest text-action-primary ml-1">Correo Electrónico</label>
            <input type="email" formControlName="email"
              class="w-full bg-surface-base/10 border border-white/10 rounded-xl px-4 py-2.5 text-content-primary focus:ring-2 focus:ring-action-primary outline-none transition-all placeholder:text-content-muted/30"
              placeholder="juan@ejemplo.com">
          </div>
    
          <div class="space-y-1.5">
            <label class="text-[10px] font-bold uppercase tracking-widest text-action-primary ml-1">DNI</label>
            <input type="text" formControlName="DNI"
              class="w-full bg-surface-base/10 border border-white/10 rounded-xl px-4 py-2.5 text-content-primary focus:ring-2 focus:ring-action-primary outline-none transition-all placeholder:text-content-muted/30"
              [class.border-rose-500]="registerForm.get('DNI')?.invalid && registerForm.get('DNI')?.touched"
              placeholder="12345678A"
              maxlength="9">
            @if (registerForm.get('DNI')?.invalid && registerForm.get('DNI')?.touched) {
              <p class="text-[10px] text-rose-500 ml-1 font-bold">
                Introduce un DNI válido (8 números + 1 letra)
              </p>
            }
          </div>
    
          @if (rol() === 'VENDEDOR') {
            <div class="space-y-1.5 animate-fade-in">
              <label class="text-[10px] font-bold uppercase tracking-widest text-action-primary ml-1">Teléfono de Contacto</label>
              <input type="tel" formControlName="telefono"
                class="w-full bg-surface-base/10 border border-white/10 rounded-xl px-4 py-2.5 text-content-primary focus:ring-2 focus:ring-action-primary outline-none transition-all placeholder:text-content-muted/30"
                [class.border-rose-500]="registerForm.get('telefono')?.invalid && registerForm.get('telefono')?.touched"
                placeholder="Ej: 600123456"
                maxlength="9">
              @if (registerForm.get('telefono')?.invalid && registerForm.get('telefono')?.touched) {
                <p class="text-[10px] text-rose-500 ml-1 font-bold">
                  Introduce un número de teléfono válido (9 dígitos)
                </p>
              }
            </div>
          }
    
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold uppercase tracking-widest text-action-primary ml-1">Contraseña</label>
              <input type="password" formControlName="password1"
                class="w-full bg-surface-base/10 border border-white/10 rounded-xl px-4 py-2.5 text-content-primary focus:ring-2 focus:ring-action-primary outline-none transition-all placeholder:text-content-muted/30"
                placeholder="••••••••">
            </div>
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold uppercase tracking-widest text-action-primary ml-1">Repetir Contraseña</label>
              <input type="password" formControlName="password2"
                [class.border-rose-500]="registerForm.errors?.['passwordMismatch'] && registerForm.get('password2')?.touched"
                class="w-full bg-surface-base/10 border border-white/10 rounded-xl px-4 py-2.5 text-content-primary focus:ring-2 focus:ring-action-primary outline-none transition-all placeholder:text-content-muted/30"
                placeholder="••••••••">
              @if (registerForm.errors?.['passwordMismatch'] && registerForm.get('password2')?.touched) {
                <p class="text-[10px] text-rose-500 ml-1 font-bold">
                  Las contraseñas no coinciden
                </p>
              }
            </div>
          </div>
    
          <div class="space-y-1.5">
            <label class="text-[10px] font-bold uppercase tracking-widest text-action-primary ml-1">Tipo de Usuario</label>
            <div class="grid grid-cols-2 gap-3">
              <button type="button" (click)="setRol('CLIENTE')"
                class="py-3 rounded-xl border transition-all font-black text-[10px] uppercase tracking-widest"
                [ngClass]="rol() === 'CLIENTE' ? 'bg-action-primary border-action-primary text-surface-base shadow-lg shadow-action-primary/20' : 'bg-surface-base/5 border-white/5 text-content-muted hover:bg-surface-base/10'">
                Cliente
              </button>
              <button type="button" (click)="setRol('VENDEDOR')"
                class="py-3 rounded-xl border transition-all font-black text-[10px] uppercase tracking-widest"
                [ngClass]="rol() === 'VENDEDOR' ? 'bg-action-primary border-action-primary text-surface-base shadow-lg shadow-action-primary/20' : 'bg-surface-base/5 border-white/5 text-content-muted hover:bg-surface-base/10'">
                Vendedor
              </button>
            </div>
          </div>

          <!-- reCAPTCHA Widget -->
          <div class="flex justify-center py-2">
            <ngx-recaptcha2
              [siteKey]="recaptchaSiteKey"
              (success)="onCaptchaSuccess($event)"
              (expire)="onCaptchaExpired()"
              [theme]="'dark'">
            </ngx-recaptcha2>
          </div>
    
          <button type="submit" [disabled]="registerForm.invalid || loading() || !recaptchaToken()"
            class="btn-primary w-full disabled:opacity-50 text-surface-base font-black py-4 rounded-xl transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-3 uppercase tracking-widest text-sm disabled:cursor-not-allowed">
            @if (loading()) {
              <div class="w-5 h-5 border-2 border-surface-base/20 border-t-surface-base rounded-full animate-spin"></div>
              <span>Creando Cuenta...</span>
            } @else {
              <span>Crear mi cuenta</span>
            }
          </button>
        </form>
    
        <footer class="text-center">
          <p class="text-content-muted text-sm">
            ¿Ya tienes cuenta?
            <a routerLink="/login" class="text-action-primary hover:text-action-hover font-bold transition-colors">Inicia sesión</a>
          </p>
        </footer>
      </div>
    </div>
    `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private ns = inject(NotificationService);

  loading = signal(false);
  rol = signal<string>('CLIENTE');

  // Clave de sitio pública oficial de pruebas de Google reCAPTCHA
  readonly recaptchaSiteKey = environment.recaptchaSiteKey;
  recaptchaToken = signal<string | null>(null);

  registerForm = this.fb.group({
    nombre: ['', Validators.required],
    apellidos: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    DNI: ['', [Validators.required, Validators.pattern(/^[0-9]{8}[A-Za-z]$/)]],
    telefono: [''],
    password1: ['', [Validators.required, Validators.minLength(4)]],
    password2: ['', [Validators.required, Validators.minLength(4)]]
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(control: any) {
    const p1 = control.get('password1')?.value;
    const p2 = control.get('password2')?.value;
    return p1 === p2 ? null : { passwordMismatch: true };
  }

  onCaptchaSuccess(token: string) {
    this.recaptchaToken.set(token);
  }

  onCaptchaExpired() {
    this.recaptchaToken.set(null);
  }

  setRol(r: string) {
    this.rol.set(r);
    const telefonoControl = this.registerForm.get('telefono');
    if (r === 'VENDEDOR') {
      telefonoControl?.setValidators([Validators.required, Validators.pattern(/^[0-9]{9}$/)]);
    } else {
      telefonoControl?.clearValidators();
      telefonoControl?.setValue('');
    }
    telefonoControl?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.registerForm.valid) {
      if (!this.recaptchaToken()) {
        this.ns.error('Por favor, completa la verificación "No soy un robot"');
        return;
      }
      this.loading.set(true);
      const data = { 
        ...this.registerForm.value, 
        rol: this.rol(),
        recaptchaToken: this.recaptchaToken()
      };
      this.authService.register(data as any).subscribe({
        next: (user) => {
          if (user) {
            this.ns.success('Cuenta creada con éxito');
            this.router.navigate(['/']);
          } else {
            this.ns.error('Error al iniciar sesión tras el registro');
            this.loading.set(false);
          }
        },
        error: (err) => {
          const msg = err.error?.message || 'Error al crear la cuenta. Revisa los datos.';
          this.ns.error(msg);
          this.loading.set(false);
        }
      });
    } else {
      if (this.registerForm.errors?.['passwordMismatch']) {
        this.ns.error('Las contraseñas no coinciden');
      } else {
        this.ns.error('Por favor, rellena todos los campos correctamente');
      }
    }
  }
}
