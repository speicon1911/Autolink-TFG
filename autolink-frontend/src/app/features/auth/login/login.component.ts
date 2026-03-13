import { Component, inject, signal } from '@angular/core';

import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-md mx-auto mt-12 animate-fade-in">
      <div class="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-8">
        <header class="text-center space-y-2">
          <h1 class="text-3xl font-black text-white">Bienvenido de nuevo</h1>
          <p class="text-slate-400">Introduce tus credenciales para acceder</p>
        </header>
    
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="space-y-1">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Correo Electrónico</label>
            <input type="email" formControlName="username"
              class="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
              placeholder="ejemplo@autolink.com">
            </div>
    
            <div class="space-y-1">
              <label class="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Contraseña</label>
              <input type="password" formControlName="password"
                class="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                placeholder="••••••••">
              </div>
    
              <button type="submit" [disabled]="loginForm.invalid || loading()"
                class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-2">
                @if (!loading()) {
                  <span>Iniciar Sesión</span>
                }
                @if (loading()) {
                  <div class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                }
              </button>
            </form>
    
            <footer class="text-center">
              <p class="text-slate-500 text-sm">
                ¿No tienes cuenta?
                <a routerLink="/register" class="text-blue-500 hover:text-blue-400 font-bold transition-colors">Regístrate gratis</a>
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
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private ns = inject(NotificationService);

  loading = signal(false);

  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.authService.login(this.loginForm.value as any).subscribe({
        next: (user) => {
          if (user) {
            this.ns.success('Sesión iniciada correctamente');
            this.router.navigate(['/']);
          } else {
            this.ns.error('No se pudo recuperar el perfil del usuario');
            this.loading.set(false);
          }
        },
        error: (err) => {
          this.ns.error(err.error?.message || 'Error al iniciar sesión. Revisa tus credenciales.');
          this.loading.set(false);
        }
      });
    }
  }
}
