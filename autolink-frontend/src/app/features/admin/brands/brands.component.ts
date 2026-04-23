import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { MarcaService } from '../../../core/services/marca.service';
import { Marca } from '../../../core/models/vehicle.model';
import { NotificationService } from '../../../core/services/notification.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-admin-brands',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, ConfirmModalComponent],
  template: `
    <div class="space-y-6 animate-fade-in relative z-0">
      <header>
        <h1 class="text-3xl font-black text-pitch-black-50">Gestión de Marcas</h1>
        <p class="text-baltic-blue-400">Administra las marcas de vehículos disponibles en el sistema</p>
      </header>
 
      <div class="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-8">
        <!-- Lista de Marcas -->
        <div class="bg-white/5 backdrop-blur-xl border border-baltic-blue-500/20 rounded-3xl overflow-hidden shadow-2xl">
          @if (loading()) {
            <div class="flex justify-center py-20">
              <div class="w-12 h-12 border-4 border-baltic-blue-500/20 border-t-baltic-blue-500 rounded-full animate-spin"></div>
            </div>
          } @else {
            <table class="w-full text-left">
              <thead class="bg-white/5 border-b border-white/5">
                <tr>
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-baltic-blue-400">ID</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-baltic-blue-400">Nombre de la Marca</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-baltic-blue-400 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                @for (m of brands(); track m.idMarca) {
                  <tr class="hover:bg-white/5 transition-colors group">
                    <td class="px-6 py-4 font-mono text-xs text-baltic-blue-300/60">#{{ m.idMarca }}</td>
                    <td class="px-6 py-4 text-pitch-black-50 font-bold uppercase tracking-tight">{{ m.nombre }}</td>
                    <td class="px-6 py-4 text-right">
                      <button (click)="requestDeleteBrand(m)" class="p-2 hover:bg-rose-500/10 rounded-lg text-baltic-blue-400 hover:text-rose-500 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
            
            @if (totalItems() > 0) {
              <div class="px-2 sm:px-6 py-4 border-t border-white/5 bg-white/5 flex justify-center w-full">
                <app-pagination
                  [totalItems]="totalItems()"
                  [itemsPerPage]="itemsPerPage"
                  [currentPage]="currentPage() + 1"
                  (pageChange)="onPageChange($event)"
                  class="w-full">
                </app-pagination>
              </div>
            }
          }
        </div>
 
        <!-- Formulario de Añadir -->
        <div class="space-y-6">
          <div class="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-baltic-blue-500/20 shadow-xl">
            <h3 class="text-pitch-black-50 font-black uppercase tracking-widest text-xs mb-6">Añadir Nueva Marca</h3>
            <form (submit)="createBrand($event)" class="space-y-4">
              <div class="space-y-2">
                <label class="block text-[10px] font-black text-baltic-blue-400 uppercase tracking-widest mb-2 ml-1">Nombre</label>
                <input 
                  type="text" 
                  [(ngModel)]="newBrandName" 
                  name="brandName"
                  placeholder="Ej. Ferrari, Tesla..."
                  class="w-full bg-white/10 border border-dark-teal-800 text-pitch-black-50 rounded-2xl p-4 focus:ring-2 focus:ring-baltic-blue-500 outline-none transition-all font-bold placeholder:text-pitch-black-50/20"
                >
              </div>
              <button 
                type="submit"
                [disabled]="!newBrandName().trim() || saving()"
                class="w-full btn-primary font-black py-4 rounded-2xl transition-all shadow-xl shadow-baltic-blue-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
              >
                @if (saving()) {
                  <div class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Añadir Marca
                }
              </button>
            </form>
          </div>
 
          <div class="bg-baltic-blue-500/5 border border-baltic-blue-500/20 p-6 rounded-3xl">
            <p class="text-[10px] text-baltic-blue-400 font-bold uppercase tracking-widest mb-2 group flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              Información
            </p>
            <p class="text-xs text-baltic-blue-300/60 leading-relaxed">
              Las marcas añadidas aquí aparecerán inmediatamente disponibles en los filtros de búsqueda y en los formularios de publicación de vehículos de los vendedores.
            </p>
          </div>
        </div>
      </div>

      <app-confirm-modal
        [isOpen]="showConfirmModal()"
        title="Eliminar Marca"
        [message]="'¿Estás seguro de que deseas eliminar la marca ' + brandToDelete()?.nombre + '? Esto podría afectar a los vehículos asociados.'"
        (confirmed)="confirmDelete()"
        (cancelled)="cancelDelete()"
      ></app-confirm-modal>

    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class AdminBrandsComponent implements OnInit {
  private marcaService = inject(MarcaService);
  private ns = inject(NotificationService);

  brands = signal<Marca[]>([]);
  loading = signal(true);
  saving = signal(false);
  newBrandName = signal('');

  // Pagination state
  totalItems = signal(0);
  currentPage = signal(0); // 0-indexed for backend
  itemsPerPage = 10;

  showConfirmModal = signal(false);
  brandToDelete = signal<Marca | null>(null);

  ngOnInit() {
    this.loadBrands();
  }

  loadBrands() {
    this.loading.set(true);
    this.marcaService.getAll(this.currentPage(), this.itemsPerPage, 'idMarca,desc').subscribe({
      next: (response) => {
        this.brands.set(response.content || []);
        const total = response.page?.totalElements ?? response.totalElements ?? response.content?.length ?? 0;
        this.totalItems.set(total);
        this.loading.set(false);
      },
      error: () => {
        this.brands.set([]);
        this.totalItems.set(0);
        this.loading.set(false);
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage.set(page - 1);
    this.loadBrands();
  }

  createBrand(event: Event) {
    event.preventDefault();
    const rawName = this.newBrandName().trim();
    if (!rawName) return;

    // Sustituir espacios por _ para que sea compatible con el backend
    const name = rawName.replace(/\s+/g, '_').toUpperCase();

    this.saving.set(true);
    this.marcaService.create({ nombre: name }).subscribe({
      next: () => {
        this.ns.success(`Marca "${name}" añadida correctamente`);
        this.newBrandName.set('');
        this.saving.set(false);
        this.currentPage.set(0);
        this.loadBrands();
      },
      error: () => {
        this.ns.error('Error al añadir la marca');
        this.saving.set(false);
      }
    });
  }

  requestDeleteBrand(marca: Marca) {
    this.brandToDelete.set(marca);
    this.showConfirmModal.set(true);
  }

  cancelDelete() {
    this.showConfirmModal.set(false);
    this.brandToDelete.set(null);
  }

  confirmDelete() {
    const marca = this.brandToDelete();
    if (!marca) return;

    this.marcaService.delete(marca.idMarca).subscribe({
      next: () => {
        this.ns.success('Marca eliminada');
        this.showConfirmModal.set(false);
        this.brandToDelete.set(null);
        this.loadBrands();
      },
      error: () => {
        this.ns.error('No se pudo eliminar la marca. Es posible que tenga vehículos asociados.');
        this.showConfirmModal.set(false);
        this.brandToDelete.set(null);
      }
    });
  }
}
