import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonaService } from '../../../core/services/persona.service';
import { User, Rol } from '../../../core/models/user.model';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, ConfirmModalComponent, PaginationComponent],
  providers: [],
  template: `
    <div class="space-y-6 animate-fade-in">
      <header class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 class="text-3xl font-black text-pitch-black-50">Gestión de Usuarios</h1>
          <p class="text-baltic-blue-400">Panel de control administrativo de roles y acceso</p>
        </div>
        
        <div class="flex items-center gap-3 bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-baltic-blue-500/20 shadow-sm">
          <button (click)="setFilter('todos')" 
            [class]="filter() === 'todos' ? 'bg-baltic-blue-500 text-white shadow-md shadow-baltic-blue-500/20' : 'text-baltic-blue-300/60 hover:text-baltic-blue-400'"
            class="px-4 py-2 rounded-xl text-xs font-bold transition-all">Todos</button>
          <button (click)="setFilter('activos')" 
            [class]="filter() === 'activos' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'text-baltic-blue-300/60 hover:text-emerald-600'"
            class="px-4 py-2 rounded-xl text-xs font-bold transition-all">Activos</button>
          <button (click)="setFilter('inactivos')" 
            [class]="filter() === 'inactivos' ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20' : 'text-baltic-blue-300/60 hover:text-rose-600'"
            class="px-4 py-2 rounded-xl text-xs font-bold transition-all">Inactivos</button>
        </div>
      </header>
    
      @if (loading()) {
        <div class="flex justify-center py-20">
          <div class="w-12 h-12 border-4 border-baltic-blue-500/20 border-t-baltic-blue-500 rounded-full animate-spin"></div>
        </div>
      }
    
      @if (!loading()) {
        <div class="bg-white/5 backdrop-blur-xl border border-baltic-blue-500/20 rounded-3xl overflow-hidden shadow-2xl">
          <table class="w-full text-left">
            <thead class="bg-white/5 border-b border-white/5">
              <tr>
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-baltic-blue-400">Usuario</th>
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-baltic-blue-400">Email</th>
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-baltic-blue-400">Rol Actual</th>
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-baltic-blue-400">Estado</th>
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-baltic-blue-400">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              @for (u of paginatedUsers(); track u) {
                <tr class="hover:bg-white/40 transition-colors group">
                  <td class="px-6 py-5">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center font-bold text-baltic-blue-400 border border-white/5">
                        {{ u.nombre.charAt(0) }}{{ u.apellidos.charAt(0) }}
                      </div>
                      <div>
                        <p class="text-pitch-black-50 font-bold">{{ u.nombre }} {{ u.apellidos }}</p>
                        <p class="text-baltic-blue-400/60 text-xs">ID: #{{ u.id }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-5">
                    <p class="text-pitch-black-50/80 text-sm italic">{{ u.correo }}</p>
                    <p class="text-baltic-blue-400/60 text-xs font-bold">{{ u.DNI }}</p>
                  </td>
                  <td class="px-6 py-5">
                 <span [ngClass]="{
                   'bg-dark-amaranth-500/10 text-dark-amaranth-400 border-dark-amaranth-500/20': u.rol === 'ADMINISTRADOR',
                   'bg-baltic-blue-500/10 text-baltic-blue-400 border-baltic-blue-500/20': u.rol === 'VENDEDOR',
                   'bg-white/5 text-baltic-blue-300/60 border-white/5': u.rol === 'CLIENTE'
                 }" class="px-3 py-1 rounded-full text-[10px] font-black border tracking-wider uppercase">
                      {{ u.rol }}
                    </span>
                  </td>
                   <td class="px-6 py-5">
                     <span [class]="u.activo ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-600 bg-rose-500/10 border-rose-500/20'" 
                           class="px-2 py-0.5 rounded text-[10px] font-bold border">
                       {{ u.activo ? 'ACTIVO' : 'INACTIVO' }}
                     </span>
                  </td>
                  <td class="px-6 py-5">
                    <div class="flex items-center gap-2">
                      <div class="relative group/select">
                        <select
                          [value]="u.rol"
                          (change)="onRolChange(u, $event)"
                          class="appearance-none bg-white/10 border border-white/5 text-pitch-black-50 text-xs rounded-lg focus:ring-baltic-blue-500 focus:border-baltic-blue-500 block w-full p-2 pr-8 cursor-pointer hover:bg-white/20 transition-colors"
                          >
                          @for (r of roles; track r) {
                            <option [value]="r" class="bg-dark-teal-900 border-none">{{ r }}</option>
                          }
                        </select>
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-baltic-blue-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                      </div>
                      @if (u.activo) {
                        <button (click)="openDeleteModal(u)" class="p-2 hover:bg-rose-500/10 rounded-lg text-baltic-blue-400 hover:text-rose-500 transition-all" title="Desactivar Usuario">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
                        </button>
                      } @else {
                        <button (click)="reactivarUsuario(u)" class="p-2 hover:bg-emerald-500/10 rounded-lg text-baltic-blue-400 hover:text-emerald-500 transition-all" title="Reactivar Usuario">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
                        </button>
                      }
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
          
          <div class="border-t border-white/5 bg-white/5">
            <app-pagination
              [totalItems]="users().length"
              [itemsPerPage]="itemsPerPage"
              [currentPage]="currentPage"
              (pageChange)="onPageChange($event)">
            </app-pagination>
          </div>
        </div>
      }
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
  paginatedUsers = signal<User[]>([]);
  loading = signal(true);
  roles = Object.values(Rol);

  currentPage = 1;
  itemsPerPage = 10;
  filter = signal<'todos' | 'activos' | 'inactivos'>('todos');

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
    const activoParam = this.filter() === 'activos' ? true : (this.filter() === 'inactivos' ? false : undefined);
    
    this.personaService.listPersonas(activoParam).subscribe({
      next: (usuarios) => {
        this.users.set(usuarios);
        this.currentPage = 1;
        this.updatePaginatedUsers();
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  setFilter(f: 'todos' | 'activos' | 'inactivos') {
    this.filter.set(f);
    this.cargarUsuarios();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePaginatedUsers();
  }

  private updatePaginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers.set(this.users().slice(startIndex, endIndex));
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
      title: 'Desactivar Usuario',
      message: `¿Estás seguro de que deseas desactivar a ${user.nombre}? Sus vehículos publicados dejarán de estar disponibles.`,
      action: 'deleteUser',
      data: { user }
    });
  }

  reactivarUsuario(user: User) {
    this.personaService.updatePerfil(user.id, { activo: true }).subscribe({
      next: () => {
        this.ns.success(`Usuario ${user.nombre} reactivado`);
        this.cargarUsuarios();
      },
      error: () => this.ns.error('Error al reactivar usuario')
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
          this.ns.success('Usuario desactivado correctamente');
          this.cargarUsuarios();
          this.closeModal();
        },
        error: () => {
          this.ns.error('Error al desactivar el usuario');
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
