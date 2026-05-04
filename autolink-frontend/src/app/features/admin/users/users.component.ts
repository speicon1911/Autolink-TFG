import { Component, OnInit, inject, signal } from '@angular/core';
import { FormatEnumPipe } from '../../../shared/pipes/format-enum.pipe';
import { CommonModule } from '@angular/common';
import { PersonaService } from '../../../core/services/persona.service';
import { User, Rol } from '../../../core/models/user.model';
import { NotificationService } from '../../../core/services/notification.service';
import { ChatService } from '../../../core/services/chat.service';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { PaginatedResponse } from '../../../core/models/pagination.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, ConfirmModalComponent, PaginationComponent, FormatEnumPipe],
  providers: [],
  template: `
    <div class="space-y-6 animate-fade-in">
      <header class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 class="text-3xl font-black text-content-primary">Gestión de Usuarios</h1>
          <p class="text-content-secondary">Panel de control administrativo de roles y acceso</p>
        </div>
        
        <div class="flex flex-col sm:flex-row items-center gap-4 bg-surface-card backdrop-blur-md p-2 rounded-2xl border border-white/5 shadow-xl">
          <!-- Filtros de Estado -->
          <div class="flex items-center gap-1 border-white/10 sm:border-r sm:pr-3">
            <button (click)="setFilter('todos')" 
              [class]="filter() === 'todos' ? 'bg-action-primary text-surface-base shadow-lg shadow-action-primary/20' : 'text-content-muted hover:text-content-primary hover:bg-white/5'"
              class="px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all">Todos</button>
            <button (click)="setFilter('activos')" 
              [class]="filter() === 'activos' ? 'bg-emerald-500 text-surface-base shadow-lg shadow-emerald-500/20' : 'text-content-muted hover:text-emerald-400 hover:bg-white/5'"
              class="px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all">Activos</button>
            <button (click)="setFilter('inactivos')" 
              [class]="filter() === 'inactivos' ? 'bg-rose-500 text-surface-base shadow-lg shadow-rose-500/20' : 'text-content-muted hover:text-rose-400 hover:bg-white/5'"
              class="px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all">Inactivos</button>
          </div>

          <!-- Filtro de Rol -->
          <div class="flex items-center gap-2 pl-1 w-full sm:w-auto">
            <span class="text-[10px] uppercase font-black tracking-widest text-content-muted ml-1 hidden lg:block">Rol:</span>
            <div class="relative w-full sm:w-40 group/filter">
              <select
                (change)="onRolFilterChange($event)"
                class="appearance-none w-full bg-surface-base/50 border border-white/10 text-content-primary text-xs rounded-xl focus:ring-2 focus:ring-action-primary outline-none block p-2.5 pr-10 cursor-pointer hover:bg-surface-base transition-all font-bold"
                >
                <option value="TODOS" class="bg-surface-card text-content-primary">Todos los roles</option>
                @for (r of roles; track r) {
                  <option [value]="r" class="bg-surface-card text-content-primary">{{ r | formatEnum }}</option>
                }
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-action-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>
        </div>
      </header>
    
      @if (loading()) {
        <div class="flex justify-center py-20">
          <div class="w-12 h-12 border-4 border-action-primary/20 border-t-action-primary rounded-full animate-spin"></div>
        </div>
      }
    
      @if (!loading()) {
        <div class="bg-surface-card backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-surface-base/50 border-b border-white/5">
                <tr>
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-content-muted">Usuario</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-content-muted">Identificación</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-content-muted">Rol</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-content-muted">Estado</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-content-muted text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                @for (u of users(); track u.id) {
                  <tr class="hover:bg-white/5 transition-colors group">
                    <td class="px-6 py-5">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-surface-base flex items-center justify-center font-black text-action-primary border border-white/5 shadow-inner">
                          {{ u.nombre.charAt(0) }}{{ u.apellidos.charAt(0) }}
                        </div>
                        <div>
                          <p class="text-content-primary font-bold">{{ u.nombre }} {{ u.apellidos }}</p>
                          <p class="text-content-muted text-[10px] uppercase tracking-tighter">ID: #{{ u.id }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-5">
                      <p class="text-content-primary/80 text-sm font-medium">{{ u.correo }}</p>
                      <p class="text-content-muted text-[10px] font-black tracking-widest">{{ u.DNI }}</p>
                    </td>
                    <td class="px-6 py-5">
                   <span [ngClass]="{
                     'bg-action-primary/10 text-action-primary border-action-primary/20': u.rol === 'ADMINISTRADOR',
                     'bg-action-primary/5 text-action-primary/80 border-action-primary/10': u.rol === 'VENDEDOR',
                     'bg-surface-base text-content-muted border-white/5': u.rol === 'CLIENTE'
                   }" class="px-3 py-1 rounded-lg text-[10px] font-black border tracking-wider uppercase">
                        {{ u.rol | formatEnum }}
                      </span>
                    </td>
                     <td class="px-6 py-5">
                       <span [class]="u.activo ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-500 bg-rose-500/10 border-rose-500/20'" 
                             class="px-2 py-0.5 rounded text-[10px] font-black border tracking-tighter">
                         {{ u.activo ? 'ACTIVO' : 'INACTIVO' }}
                       </span>
                    </td>
                    <td class="px-6 py-5">
                      <div class="flex items-center justify-end gap-3">
                        <div class="relative w-36 group/select">
                          <select
                            [value]="u.rol"
                            (change)="onRolChange(u, $event)"
                            class="appearance-none w-full bg-surface-base/50 border border-white/10 text-content-primary text-[11px] font-bold rounded-lg focus:ring-2 focus:ring-action-primary outline-none block p-2 pr-8 cursor-pointer hover:bg-surface-base transition-all"
                            >
                            @for (r of roles; track r) {
                              <option [value]="r" class="bg-surface-card text-content-primary">{{ r | formatEnum }}</option>
                            }
                          </select>
                          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-action-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                          </div>
                        </div>

                        <div class="flex items-center gap-1 border-l border-white/10 pl-3">
                          @if (u.activo) {
                            <button (click)="openDeleteModal(u)" class="p-2 hover:bg-rose-500/10 rounded-lg text-content-muted hover:text-rose-500 transition-all" title="Desactivar Usuario">
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
                            </button>
                          } @else {
                            <button (click)="reactivarUsuario(u)" class="p-2 hover:bg-emerald-500/10 rounded-lg text-content-muted hover:text-emerald-500 transition-all" title="Reactivar Usuario">
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
                            </button>
                          }
                          <button (click)="iniciarChat(u)" class="p-2 hover:bg-action-primary/10 rounded-lg text-content-muted hover:text-action-primary transition-all" title="Enviar Mensaje">
                            <i class="fas fa-comment-dots text-lg"></i>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          
          <div class="border-t border-white/5 bg-surface-base">
            <app-pagination
              [totalItems]="totalItems()" 
              [itemsPerPage]="itemsPerPage"
              [currentPage]="currentPage() + 1"
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
      [loading]="isProcessing()"
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
  private chatService = inject(ChatService);

  users = signal<User[]>([]);          // Solo los usuarios de la página actual
  loading = signal(true);
  isProcessing = signal(false);
  roles = Object.values(Rol);

  // ESTADO DE PAGINACIÓN Y FILTRO
  totalItems = signal(0);              // Total de elementos en la DB
  currentPage = signal(0);             // Página actual (Base 0 para Spring)
  itemsPerPage = 10;                   // Tamaño de página deseado
  filter = signal<'todos' | 'activos' | 'inactivos'>('todos');
  rolFilter = signal<string>('TODOS');

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

  iniciarChat(user: User) {
    this.chatService.abrirChatCon(user);
  }

  // [MODIFICADO] La función maestra ahora usa el servicio paginado
  cargarUsuarios() {
    this.loading.set(true);
    
    let activo: boolean | undefined;
    if (this.filter() === 'activos') activo = true;
    else if (this.filter() === 'inactivos') activo = false;

    this.personaService.getPersonasPaginadas(
      this.currentPage(), 
      this.itemsPerPage,
      this.rolFilter(),
      activo
    ).subscribe({
      next: (response: PaginatedResponse<User>) => {
        this.users.set(response.content || []);
        const total = response.page?.totalElements ?? response.totalElements ?? response.content?.length ?? 0;
        this.totalItems.set(total);
        this.loading.set(false);
      },
      error: () => {
        this.ns.error('Error al cargar usuarios');
        this.loading.set(false);
      }
    });
  }

  // [MODIFICADO] Resetear a pág 0 al filtrar
  setFilter(f: 'todos' | 'activos' | 'inactivos') {
    this.filter.set(f);
    this.currentPage.set(0); 
    this.cargarUsuarios();
  }

  onRolFilterChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.rolFilter.set(val);
    this.currentPage.set(0);
    this.cargarUsuarios();
  }

  // [MODIFICADO] Pedir datos nuevos al cambiar página
  onPageChange(page: number) {
    this.currentPage.set(page - 1); // Angular envía 1, 2... Spring quiere 0, 1...
    this.cargarUsuarios();
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
    this.isProcessing.set(true);
    this.personaService.updatePerfil(user.id, { activo: true }).subscribe({
      next: () => {
        this.ns.success(`Usuario ${user.nombre} reactivado`);
        this.isProcessing.set(true); // Wait for cargarUsuarios
        this.cargarUsuarios();
      },
      error: () => {
        this.ns.error('Error al reactivar usuario');
        this.isProcessing.set(false);
      }
    });
  }

  handleModalConfirm() {
    const config = this.modalConfig();
    if (!config.data) return;

    if (config.action === 'updateRol' && config.data.newRol) {
      this.isProcessing.set(true);
      this.personaService.updateRol(config.data.user.id, config.data.newRol).subscribe({
        next: () => {
          this.ns.success(`Rol de ${config.data?.user.nombre} actualizado a ${config.data?.newRol}`);
          this.isProcessing.set(false);
          this.cargarUsuarios();
          this.closeModal();
        },
        error: () => {
          this.ns.error('Error al actualizar el rol');
          this.isProcessing.set(false);
          this.cargarUsuarios(); // Reset selection
          this.closeModal();
        }
      });
    } else if (config.action === 'deleteUser') {
      this.isProcessing.set(true);
      this.personaService.deletePersona(config.data.user.id).subscribe({
        next: () => {
          this.ns.success('Usuario desactivado correctamente');
          this.isProcessing.set(false);
          this.cargarUsuarios();
          this.closeModal();
        },
        error: () => {
          this.ns.error('Error al desactivar el usuario');
          this.isProcessing.set(false);
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
