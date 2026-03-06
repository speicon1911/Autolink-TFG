import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonaService } from '../../../core/services/persona.service';
import { User, Rol } from '../../../core/models/user.model';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
    selector: 'app-admin-users',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-6 animate-fade-in">
      <header>
        <h1 class="text-3xl font-black text-white">Gestión de Usuarios</h1>
        <p class="text-slate-400">Panel de control administrativo de roles y acceso</p>
      </header>

      <div *ngIf="loading()" class="flex justify-center py-20">
        <div class="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      </div>

      <div *ngIf="!loading()" class="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <table class="w-full text-left">
          <thead class="bg-slate-800/50 border-b border-slate-700">
            <tr>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Usuario</th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Email / DNI</th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Rol Actual</th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr *ngFor="let u of users()" class="hover:bg-slate-800/30 transition-colors group">
              <td class="px-6 py-5">
                 <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-blue-500">
                       {{ u.nombre.charAt(0) }}{{ u.apellidos.charAt(0) }}
                    </div>
                    <div>
                       <p class="text-white font-bold">{{ u.nombre }} {{ u.apellidos }}</p>
                       <p class="text-slate-500 text-xs">ID: #{{ u.id }}</p>
                    </div>
                 </div>
              </td>
              <td class="px-6 py-5">
                 <p class="text-slate-300 text-sm">{{ u.correo }}</p>
                 <p class="text-slate-500 text-xs">{{ u.DNI }}</p>
              </td>
              <td class="px-6 py-5">
                 <span [ngClass]="{
                   'bg-purple-500/10 text-purple-400 border-purple-500/20': u.rol === 'ADMINISTRADOR',
                   'bg-blue-500/10 text-blue-400 border-blue-500/20': u.rol === 'VENDEDOR',
                   'bg-slate-700 text-slate-400 border-slate-600': u.rol === 'CLIENTE'
                 }" class="px-3 py-1 rounded-full text-[10px] font-black border tracking-wider">
                   {{ u.rol }}
                 </span>
              </td>
              <td class="px-6 py-5">
                 <div class="flex items-center gap-2">
                    <button (click)="changeRol(u)" class="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all tooltip" title="Cambiar Rol">
                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m17 7 5 5-5 5"/><path d="M13 12h9"/></svg>
                    </button>
                    <button (click)="deleteUser(u)" class="p-2 hover:bg-rose-900/20 rounded-lg text-slate-400 hover:text-rose-500 transition-all">
                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                 </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
    styles: [`
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class AdminUsersComponent implements OnInit {
    private personaService = inject(PersonaService);
    private ns = inject(NotificationService);

    users = signal<User[]>([]);
    loading = signal(true);

    ngOnInit() {
        this.cargarUsuarios();
    }

    cargarUsuarios() {
        this.loading.set(true);
        // Para simplificar, listamos todos combinando resultados
        this.personaService.listClientes().subscribe({
            next: (clientes) => {
                this.personaService.listVendedores().subscribe({
                    next: (vendedores) => {
                        this.personaService.listAdmins().subscribe({
                            next: (admins) => {
                                this.users.set([...admins, ...vendedores, ...clientes]);
                                this.loading.set(false);
                            }
                        });
                    }
                });
            },
            error: () => this.loading.set(false)
        });
    }

    changeRol(user: User) {
        const nextRolMap: Record<Rol, Rol> = {
            [Rol.CLIENTE]: Rol.VENDEDOR,
            [Rol.VENDEDOR]: Rol.ADMINISTRADOR,
            [Rol.ADMINISTRADOR]: Rol.CLIENTE
        };
        const newRol = nextRolMap[user.rol];

        if (confirm(`¿Deseas cambiar el rol de ${user.nombre} a ${newRol}?`)) {
            this.personaService.updateRol(user.id, newRol).subscribe({
                next: () => {
                    this.ns.success(`Rol de ${user.nombre} actualizado a ${newRol}`);
                    this.cargarUsuarios();
                }
            });
        }
    }

    deleteUser(user: User) {
        if (confirm(`¿Estás seguro de que deseas eliminar permanentemente a ${user.nombre}?`)) {
            this.personaService.deletePersona(user.id).subscribe({
                next: () => {
                    this.ns.success('Usuario eliminado');
                    this.cargarUsuarios();
                }
            });
        }
    }
}
