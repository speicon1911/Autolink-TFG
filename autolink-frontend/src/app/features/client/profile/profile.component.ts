import { Component, OnInit, inject, signal } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { PersonaService } from '../../../core/services/persona.service';
import { NotificationService } from '../../../core/services/notification.service';
import { User } from '../../../core/models/user.model';

@Component({
    selector: 'app-client-profile',
    standalone: true,
    imports: [ReactiveFormsModule],
    template: `
    <div class="max-w-2xl mx-auto animate-fade-in">
      <div class="bg-white/5 backdrop-blur-xl border border-baltic-blue-500/20 rounded-3xl shadow-2xl overflow-hidden">
        <div class="h-32 bg-gradient-to-r from-baltic-blue-600 to-dark-teal-900"></div>
    
        <div class="px-8 pb-8">
          <div class="relative -mt-12 mb-6">
            <div class="w-24 h-24 bg-dark-teal-900 border-4 border-dark-teal-950 rounded-2xl flex items-center justify-center text-3xl font-bold text-baltic-blue-400 shadow-xl">
              {{ authService.currentUser$()?.nombre?.charAt(0) }}{{ authService.currentUser$()?.apellidos?.charAt(0) }}
            </div>
            <div class="mt-4">
              <h1 class="text-2xl font-black text-pitch-black-50">Mi Perfil</h1>
              <p class="text-baltic-blue-400 text-sm">Gestiona tu información personal</p>
            </div>
          </div>
    
          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-baltic-blue-400 ml-1">Nombre</label>
              <input type="text" formControlName="nombre"
                class="w-full bg-white/10 border-dark-teal-800 rounded-xl px-4 py-2.5 text-pitch-black-50 focus:ring-2 focus:ring-baltic-blue-500 outline-none transition-all placeholder:text-pitch-black-50/20">
              </div>
    
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-baltic-blue-400 ml-1">Apellidos</label>
                <input type="text" formControlName="apellidos"
                  class="w-full bg-white/10 border-dark-teal-800 rounded-xl px-4 py-2.5 text-pitch-black-50 focus:ring-2 focus:ring-baltic-blue-500 outline-none transition-all placeholder:text-pitch-black-50/20">
                </div>
    
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-baltic-blue-400 ml-1">DNI</label>
                  <input type="text" formControlName="DNI"
                    class="w-full bg-white/10 border-dark-teal-800 rounded-xl px-4 py-2.5 text-pitch-black-50 focus:ring-2 focus:ring-dark-teal-500 outline-none transition-all opacity-40 cursor-not-allowed" readonly>
                  </div>
    
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-baltic-blue-400 ml-1">Correo Electrónico</label>
                    <input type="email" formControlName="correo"
                      class="w-full bg-white/10 border-dark-teal-800 rounded-xl px-4 py-2.5 text-pitch-black-50 focus:ring-2 focus:ring-dark-teal-500 outline-none transition-all opacity-40 cursor-not-allowed" readonly>
                    </div>
    
                    <div class="md:col-span-2 pt-4">
                      <button type="submit" [disabled]="profileForm.invalid || loading()"
                        class="btn-primary w-full disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-baltic-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-2">
                        @if (!loading()) {
                          <span>Guardar Cambios</span>
                        }
                        @if (loading()) {
                          <div class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        }
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
