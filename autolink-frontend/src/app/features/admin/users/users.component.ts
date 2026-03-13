import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonaService } from '../../../core/services/persona.service';
import { User, Rol } from '../../../core/models/user.model';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, ConfirmModalComponent],
  providers: [],
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
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Email</th>
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
                    <div class="relative group/select">
                        <select 
                           [value]="u.rol" 
                           (change)="onRolChange(u, $event)"
                           class="appearance-none bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 pr-8 cursor-pointer hover:bg-slate-700 transition-colors"
                        >
                           <option *ngFor="let r of roles" [value]="r">{{ r }}</option>
                        </select>
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                           <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                    </div>
                    <button (click)="openDeleteModal(u)" class="p-2 hover:bg-rose-900/20 rounded-lg text-slate-400 hover:text-rose-500 transition-all">
                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                 </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Confirmación -->
    <app-confirm-modal
      [isOpen]="modalConfig().isOpen"
      [title]="modalConfig().title"
      [message]="modalConfig().message"
      (confirmed)="handleModalConfirm()"
      (cancelled)="handleModalCancel()"
    ></app-confirm-modal>
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
  roles = Object.values(Rol);

  // Configuración del modal
  modalConfig = signal<{
    isOpen: boolean;
    title: string;
    message: string;
    action: 'updateRol' | 'deleteUser' | null;
    data: { user: User; newRol?: Rol } | null;
  }>({
    isOpen: false,
    title: '',
    message: '',
    action: null,
    data: null
  });

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.loading.set(true);
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

  onRolChange(user: User, event: Event) {
    const newRol = (event.target as HTMLSelectElement).value as Rol;
    if (newRol === user.rol) return;

    this.modalConfig.set({
      isOpen: true,
      title: 'Cambiar Rol',
      message: `¿Deseas cambiar el rol de ${user.nombre} a ${newRol}?`,
      action: 'updateRol',
      data: { user, newRol }
    });
  }

  openDeleteModal(user: User) {
    this.modalConfig.set({
      isOpen: true,
      title: 'Eliminar Usuario',
      message: `¿Estás seguro de que deseas eliminar permanentemente a ${user.nombre}? Esta acción no se puede deshacer.`,
      action: 'deleteUser',
      data: { user }
    });
  }

  handleModalConfirm() {
    const config = this.modalConfig();
    if (!config.data) return;

    if (config.action === 'updateRol' && config.data.newRol) {
      this.personaService.updateRol(config.data.user.id, config.data.newRol).subscribe({
        next: () => {
          this.ns.success(`Rol de ${config.data?.user.nombre} actualizado a ${config.data?.newRol}`);
          this.cargarUsuarios();
          this.closeModal();
        },
        error: () => {
          this.ns.error('Error al actualizar el rol');
          this.cargarUsuarios(); // Reset selection
          this.closeModal();
        }
      });
    } else if (config.action === 'deleteUser') {
      this.personaService.deletePersona(config.data.user.id).subscribe({
        next: () => {
          this.ns.success('Usuario eliminado');
          this.cargarUsuarios();
          this.closeModal();
        },
        error: () => {
          this.ns.error('Error al eliminar el usuario');
          this.closeModal();
        }
      });
    }
  }

  handleModalCancel() {
    if (this.modalConfig().action === 'updateRol') {
      this.cargarUsuarios(); // Reset selection in dropdown
    }
    this.closeModal();
  }

  private closeModal() {
    this.modalConfig.update(prev => ({ ...prev, isOpen: false, action: null, data: null }));
  }
}
