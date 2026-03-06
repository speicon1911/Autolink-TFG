import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Rol } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-md mx-auto mt-8 mb-12 animate-fade-in">
      <div class="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-8">
        <header class="text-center space-y-2">
          <h1 class="text-3xl font-black text-white">Únete a AutoLink</h1>
          <p class="text-slate-400">Crea tu cuenta en segundos</p>
        </header>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Nombre</label>
              <input type="text" formControlName="nombre"
                     class="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                     placeholder="Juan">
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Apellidos</label>
              <input type="text" formControlName="apellidos"
                     class="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                     placeholder="Pérez">
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Correo Electrónico</label>
            <input type="email" formControlName="email"
                   class="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                   placeholder="juan@ejemplo.com">
          </div>

          <div class="space-y-1 animate-fade-in" *ngIf="rol() === 'VENDEDOR'">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Teléfono de Contacto</label>
            <input type="tel" formControlName="telefono"
                   class="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                   placeholder="Ej: 600123456">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Contraseña</label>
              <input type="password" formControlName="password1"
                     class="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                     placeholder="••••••••">
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Repetir Contraseña</label>
              <input type="password" formControlName="password2"
                     [class.border-red-500]="registerForm.errors?.['passwordMismatch'] && registerForm.get('password2')?.touched"
                     class="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                     placeholder="••••••••">
              <p *ngIf="registerForm.errors?.['passwordMismatch'] && registerForm.get('password2')?.touched" class="text-[10px] text-red-500 ml-1">
                Las contraseñas no coinciden
              </p>
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Tipo de Usuario</label>
            <div class="grid grid-cols-2 gap-3">
               <button type="button" (click)="setRol('CLIENTE')" 
                       class="py-3 rounded-xl border transition-all font-bold text-sm"
                       [ngClass]="rol() === 'CLIENTE' ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'">
                 Cliente
               </button>
               <button type="button" (click)="setRol('VENDEDOR')" 
                       class="py-3 rounded-xl border transition-all font-bold text-sm"
                       [ngClass]="rol() === 'VENDEDOR' ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'">
                 Vendedor
               </button>
            </div>
          </div>

          <button type="submit" [disabled]="registerForm.invalid || loading()"
                  class="w-full bg-white hover:bg-slate-100 disabled:opacity-50 text-slate-950 font-black py-4 rounded-xl transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2">
            <span *ngIf="!loading()">Crear mi cuenta</span>
            <div *ngIf="loading()" class="w-5 h-5 border-2 border-slate-900/20 border-t-slate-900 rounded-full animate-spin"></div>
          </button>
        </form>

        <footer class="text-center">
          <p class="text-slate-500 text-sm">
            ¿Ya tienes cuenta? 
            <a routerLink="/login" class="text-blue-500 hover:text-blue-400 font-bold transition-colors">Inicia sesión</a>
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

  registerForm = this.fb.group({
    nombre: ['', Validators.required],
    apellidos: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefono: [''],
    password1: ['', [Validators.required, Validators.minLength(4)]],
    password2: ['', [Validators.required, Validators.minLength(4)]]
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(control: any) {
    const p1 = control.get('password1')?.value;
    const p2 = control.get('password2')?.value;
    return p1 === p2 ? null : { passwordMismatch: true };
  }

  setRol(r: string) {
    this.rol.set(r);
    const telefonoControl = this.registerForm.get('telefono');
    if (r === 'VENDEDOR') {
      telefonoControl?.setValidators([Validators.required, Validators.pattern(/^[0-9]{9,15}$/)]);
    } else {
      telefonoControl?.clearValidators();
      telefonoControl?.setValue('');
    }
    telefonoControl?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading.set(true);
      const data = { ...this.registerForm.value, rol: this.rol() };
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
