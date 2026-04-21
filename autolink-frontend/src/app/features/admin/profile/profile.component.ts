import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { PersonaService } from '../../../core/services/persona.service';
import { NotificationService } from '../../../core/services/notification.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="max-w-2xl mx-auto animate-fade-in">
      <div class="bg-white/5 backdrop-blur-xl border border-baltic-blue-500/20 rounded-3xl shadow-2xl overflow-hidden">
        <div class="h-32 bg-gradient-to-r from-baltic-blue-600 to-dark-teal-900"></div>

        <div class="px-8 pb-8">
          <div class="relative -mt-12 mb-6 group">
            <div class="relative w-24 h-24">
              <div class="w-full h-full bg-dark-teal-900 border-4 border-dark-teal-950 rounded-2xl flex items-center justify-center text-3xl font-bold text-baltic-blue-400 shadow-xl overflow-hidden">
                @if (authService.currentUser$()?.fotoPerfil) {
                  <img [src]="authService.currentUser$()?.fotoPerfil" alt="Profile" class="w-full h-full object-cover">
                } @else {
                  {{ authService.currentUser$()?.nombre?.charAt(0) }}{{ authService.currentUser$()?.apellidos?.charAt(0) }}
                }
                
                @if (uploadingPhoto()) {
                  <div class="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div class="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  </div>
                }
              </div>
              
              <button (click)="fileInput.click()" [disabled]="uploadingPhoto()"
                class="absolute -bottom-2 -right-2 w-8 h-8 bg-baltic-blue-600 border-2 border-dark-teal-950 rounded-lg flex items-center justify-center text-white shadow-lg hover:bg-baltic-blue-500 transition-all active:scale-95 group-hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <input #fileInput type="file" class="hidden" (change)="onFileSelected($event)" accept="image/*">
            </div>

            <div class="mt-4">
              <h1 class="text-2xl font-black text-pitch-black-50">Mi Perfil</h1>
              <p class="text-baltic-blue-400 text-sm">Gestiona tu información de administrador</p>
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
              <label class="text-[10px] font-bold uppercase tracking-wider text-baltic-blue-400 ml-1">Salario Anual (€)</label>
              <input type="number" formControlName="salarioAnual"
                class="w-full bg-white/10 border-dark-teal-800 rounded-xl px-4 py-2.5 text-pitch-black-50 focus:ring-2 focus:ring-baltic-blue-500 outline-none transition-all placeholder:text-pitch-black-50/20">
            </div>

            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-baltic-blue-400 ml-1">Teléfono</label>
              <input type="number" formControlName="telefono"
                class="w-full bg-white/10 border-dark-teal-800 rounded-xl px-4 py-2.5 text-pitch-black-50 focus:ring-2 focus:ring-baltic-blue-500 outline-none transition-all placeholder:text-pitch-black-50/20">
            </div>

            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-baltic-blue-400 ml-1">Ciudad Asignada</label>
              <div class="relative">
                <select formControlName="ciudadAsignada"
                  class="w-full bg-white/10 border border-dark-teal-800 rounded-xl px-4 py-2.5 text-pitch-black-50 focus:ring-2 focus:ring-baltic-blue-500 outline-none transition-all appearance-none">
                  <option value="" class="bg-dark-teal-900">Sin asignar</option>
                  @for (city of cities(); track city) {
                    <option [value]="city" class="bg-dark-teal-900">{{ city }}</option>
                  }
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-baltic-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
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
export class AdminProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  authService = inject(AuthService);
  private personaService = inject(PersonaService);
  private ns = inject(NotificationService);

  loading = signal(false);
  uploadingPhoto = signal(false);
  cities = signal(['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao']);

  profileForm = this.fb.group({
    nombre: ['', Validators.required],
    apellidos: ['', Validators.required],
    telefono: [null as number | null, [Validators.pattern(/^[0-9]{9}$/)]],
    salarioAnual: [null as number | null],
    ciudadAsignada: [''],
    DNI: [{ value: '', disabled: true }],
    correo: [{ value: '', disabled: true }]
  });

  ngOnInit() {
    const user = this.authService.currentUser$();
    if (user) {
      this.profileForm.patchValue({
        nombre: user.nombre,
        apellidos: user.apellidos,
        telefono: user.telefono || null,
        salarioAnual: user.salarioAnual || null,
        ciudadAsignada: user.ciudadAsignada || '',
        DNI: user.DNI,
        correo: user.correo
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    const user = this.authService.currentUser$();
    if (file && user) {
      this.uploadingPhoto.set(true);
      this.personaService.actualizarFotoPerfil(user.id, file).subscribe({
        next: (updatedUser) => {
          this.authService.updateUser(updatedUser);
          this.ns.success('Foto de perfil actualizada');
          this.uploadingPhoto.set(false);
        },
        error: (err) => {
          this.uploadingPhoto.set(false);
          this.ns.error(err?.error?.message || 'Error al subir la foto');
        }
      });
    }
  }

  onSubmit() {
    const user = this.authService.currentUser$();
    if (this.profileForm.valid && user) {
      this.loading.set(true);
      const updatedData: User = {
        ...user,
        ...this.profileForm.getRawValue() as any
      };

      this.personaService.updatePerfil(user.id, updatedData).subscribe({
        next: (updatedUser) => {
          this.authService.updateUser(updatedUser);
          this.ns.success('Perfil actualizado correctamente');
          this.loading.set(false);
        },
        error: (err) => {
          this.loading.set(false);
          this.ns.error(err?.error?.message || 'Error al actualizar el perfil');
        }
      });
    }
  }
}
