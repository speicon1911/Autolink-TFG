import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { PersonaService } from '../../../core/services/persona.service';
import { NotificationService } from '../../../core/services/notification.service';
import { User } from '../../../core/models/user.model';

@Component({
    selector: 'app-client-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="max-w-2xl mx-auto animate-fade-in">
      <div class="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        <div class="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        
        <div class="px-8 pb-8">
          <div class="relative -mt-12 mb-6">
            <div class="w-24 h-24 bg-slate-800 border-4 border-slate-900 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-xl">
              {{ authService.currentUser$()?.nombre?.charAt(0) }}{{ authService.currentUser$()?.apellidos?.charAt(0) }}
            </div>
            <div class="mt-4">
              <h1 class="text-2xl font-black text-white">Mi Perfil</h1>
              <p class="text-slate-400 text-sm">Gestiona tu información personal</p>
            </div>
          </div>

          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Nombre</label>
              <input type="text" formControlName="nombre"
                     class="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
            </div>

            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Apellidos</label>
              <input type="text" formControlName="apellidos"
                     class="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
            </div>

            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">DNI</label>
              <input type="text" formControlName="DNI"
                     class="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-slate-500 outline-none transition-all opacity-70 cursor-not-allowed" readonly>
            </div>

            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Correo Electrónico</label>
              <input type="email" formControlName="correo"
                     class="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-slate-500 outline-none transition-all opacity-70 cursor-not-allowed" readonly>
            </div>

            <div class="md:col-span-2 pt-4">
              <button type="submit" [disabled]="profileForm.invalid || loading()"
                      class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-2">
                <span *ngIf="!loading()">Guardar Cambios</span>
                <div *ngIf="loading()" class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class ClientProfileComponent implements OnInit {
    private fb = inject(FormBuilder);
    authService = inject(AuthService);
    private personaService = inject(PersonaService);
    private ns = inject(NotificationService);

    loading = signal(false);

    profileForm = this.fb.group({
        nombre: ['', Validators.required],
        apellidos: ['', Validators.required],
        DNI: [{ value: '', disabled: true }],
        correo: [{ value: '', disabled: true }]
    });

    ngOnInit() {
        const user = this.authService.currentUser$();
        if (user) {
            this.profileForm.patchValue({
                nombre: user.nombre,
                apellidos: user.apellidos,
                DNI: user.DNI,
                correo: user.correo
            });
        }
    }

    onSubmit() {
        const user = this.authService.currentUser$();
        if (this.profileForm.valid && user) {
            this.loading.set(true);
            this.personaService.updatePerfil(user.id, this.profileForm.getRawValue() as User).subscribe({
                next: (updatedUser) => {
                    this.ns.success('Perfil actualizado correctamente');
                    this.loading.set(false);
                    // In a real app, we might want to update the auth service user signal too
                },
                error: () => this.loading.set(false)
            });
        }
    }
}
