import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentaService } from '../../../core/services/venta.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Sale } from '../../../core/models/sale.model';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-seller-sales',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe, ConfirmModalComponent, PaginationComponent],
  template: `
    <div class="space-y-6 animate-fade-in">
      <header>
        <h1 class="text-3xl font-black text-content-primary">Mis Ventas</h1>
        <p class="text-content-secondary">Seguimiento de tus operaciones cerradas</p>
      </header>
    
      @if (loading()) {
        <div class="flex justify-center py-20">
          <div class="w-12 h-12 border-4 border-action-primary/20 border-t-action-primary rounded-full animate-spin"></div>
        </div>
      }
    
      @if (!loading() && sales().length === 0) {
        <div class="text-center py-20 bg-surface-card backdrop-blur-sm rounded-3xl border border-dashed border-white/10">
          <p class="text-content-muted text-lg">Aún no has registrado ninguna venta.</p>
        </div>
      }
    
      <!-- Resumen de Ventas -->
      @if (!loading() && sales().length > 0) {
        <div class="bg-gradient-to-br from-action-primary/80 to-action-primary border border-white/10 rounded-3xl p-8 mb-8 flex items-center justify-between shadow-2xl text-surface-base shadow-action-primary/10">
          <div>
            <h2 class="text-surface-base/60 font-black uppercase tracking-widest text-[10px] mb-1">Total Ingresado</h2>
            <p class="text-4xl font-black">{{ totalSales() | currency:'EUR':'symbol':'1.0-0' }}</p>
          </div>
          <div class="text-right">
            <h2 class="text-surface-base/60 font-black uppercase tracking-widest text-[10px] mb-1">Vehículos Vendidos</h2>
            <p class="text-4xl font-black">{{ sales().length }}</p>
          </div>
        </div>
      }
    
      <!-- Status Filter -->
      @if (!loading() && sales().length > 0) {
        <div class="flex flex-wrap items-center gap-2 mb-4">
          <button (click)="setStatus('TODAS')" 
            [class]="selectedStatus() === 'TODAS' ? 'px-4 py-1.5 bg-action-primary text-surface-base rounded-xl font-black text-xs transition-all' : 'px-4 py-1.5 bg-surface-card text-content-secondary hover:text-action-primary rounded-xl font-bold text-xs transition-all border border-white/5'">TODAS</button>
          <button (click)="setStatus('REALIZADA')" 
            [class]="selectedStatus() === 'REALIZADA' ? 'px-4 py-1.5 bg-emerald-500 text-surface-base rounded-xl font-black text-xs transition-all' : 'px-4 py-1.5 bg-surface-card text-content-secondary hover:text-emerald-500 rounded-xl font-bold text-xs transition-all border border-white/5'">VENDIDOS</button>
          <button (click)="setStatus('EN_PROGRESO')" 
            [class]="selectedStatus() === 'EN_PROGRESO' ? 'px-4 py-1.5 bg-amber-500 text-surface-base rounded-xl font-black text-xs transition-all' : 'px-4 py-1.5 bg-surface-card text-content-secondary hover:text-amber-500 rounded-xl font-bold text-xs transition-all border border-white/5'">PENDIENTES</button>
          <button (click)="setStatus('ANULADA')" 
            [class]="selectedStatus() === 'ANULADA' ? 'px-4 py-1.5 bg-rose-500 text-surface-base rounded-xl font-black text-xs transition-all' : 'px-4 py-1.5 bg-surface-card text-content-secondary hover:text-rose-500 rounded-xl font-bold text-xs transition-all border border-white/5'">ANULADAS</button>
        </div>
      }

      <!-- Lista de Ventas -->
      @if (!loading() && pagedSales().length > 0) {
        <div class="grid gap-4">
          @for (s of pagedSales(); track s.idVenta) {
            <div
              class="bg-surface-card backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-action-primary/50 shadow-xl transition-all group">
              <div class="flex items-center gap-5 w-full md:w-auto">
                <div class="w-14 h-14 bg-surface-base rounded-xl flex items-center justify-center text-action-primary shrink-0 border border-white/5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5-3"/><path d="M22 12H2"/></svg>
                </div>
                <div class="space-y-1">
                  <h3 class="text-content-primary font-bold text-lg">
                    {{ s.vehiculo.marca?.nombre }} {{ s.vehiculo.modelo }}
                  </h3>
                  <p class="text-content-secondary text-sm">Cliente: {{ s.cliente.nombre }} {{ s.cliente.apellidos }}</p>
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-6 justify-end w-full md:w-auto">
                <div class="text-right">
                  <p class="text-[10px] text-content-muted font-black uppercase tracking-widest">Fecha</p>
                  <p class="text-sm text-content-primary font-medium">{{ s.fecha | date:'mediumDate':'':'es' }}</p>
                </div>
                <div class="text-right">
                  <p class="text-[10px] text-content-muted font-black uppercase tracking-widest">Precio Final</p>
                  @if (editingId() === s.idVenta) {
                    <div class="flex items-center gap-2 mt-1">
                      <input type="number" [(ngModel)]="newPrice" class="w-24 bg-surface-base border border-action-primary rounded p-1 text-content-primary text-right outline-none">
                      <button (click)="savePrice(s)" [disabled]="isProcessing()" class="text-emerald-500 hover:text-emerald-400 disabled:opacity-50">
                        @if (isProcessing()) {
                          <div class="w-5 h-5 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                        } @else {
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        }
                      </button>
                      <button (click)="editingId.set(null)" [disabled]="isProcessing()" class="text-rose-500 hover:text-rose-400 disabled:opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  } @else {
                    <p class="text-2xl font-black text-action-primary flex items-center gap-2">
                      {{ s.precio | currency:'EUR':'symbol':'1.0-0' }}
                      <button (click)="startEdit(s)" class="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all text-content-muted">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                      </button>
                    </p>
                  }
                </div>
                <div class="flex items-center gap-2 border-l border-white/5 pl-6">
                  @if (s.estadoVenta === 'EN_PROGRESO') {
                    @if (s.rolUltimoModificador !== 'VENDEDOR') {
                      <button (click)="completeSale(s)" class="p-2 hover:bg-emerald-500/10 rounded-lg text-content-muted hover:text-emerald-500 transition-all tooltip" title="Finalizar Venta">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      </button>
                      <button (click)="startEdit(s)" class="p-2 hover:bg-action-primary/10 rounded-lg text-content-muted hover:text-action-primary transition-all tooltip" title="Editar Precio (Negociar)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                      </button>
                      <button (click)="cancelSale(s)" class="p-2 hover:bg-rose-500/10 rounded-lg text-content-muted hover:text-rose-500 transition-all tooltip" title="Anular Operación">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      </button>
                    } @else {
                      <span class="text-amber-500 text-xs italic mr-2 whitespace-nowrap">Esperando respuesta...</span>
                      <button (click)="cancelSale(s)" class="p-2 hover:bg-rose-500/10 rounded-lg text-content-muted hover:text-rose-500 transition-all tooltip" title="Anular Operación">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      </button>
                    }
                  } @else {
                    <span [ngClass]="{
                      'bg-emerald-500/10 text-emerald-500 border-emerald-500/20': s.estadoVenta === 'REALIZADA',
                      'bg-rose-500/10 text-rose-500 border-rose-500/20': s.estadoVenta === 'ANULADA'
                    }" class="px-3 py-1 rounded-full text-[10px] font-bold border uppercase">
                      {{ s.estadoVenta }}
                    </span>
                  }
                </div>
              </div>
            </div>
          }
        </div>

        <div class="mt-8 pt-6 border-t border-white/5">
          <app-pagination
            [totalItems]="totalFilteredItems()"
            [itemsPerPage]="itemsPerPage"
            [currentPage]="currentPage() + 1"
            (pageChange)="onPageChange($event)">
          </app-pagination>
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
    .tooltip { position: relative; }
  `]
})
export class SellerSalesComponent implements OnInit {
  private ventaService = inject(VentaService);
  private authService = inject(AuthService);
  private ns = inject(NotificationService);

  sales = signal<Sale[]>([]);
  loading = signal(true);
  isProcessing = signal(false);
  totalSales = signal<number>(0);
  editingId = signal<number | null>(null);
  newPrice: number = 0;

  // Pagination + Filters
  currentPage = signal(0);
  itemsPerPage = 10;
  selectedStatus = signal<string>('TODAS');

  filteredSales = computed(() => {
    const status = this.selectedStatus();
    const all = this.sales();
    return status === 'TODAS' ? all : all.filter(s => s.estadoVenta === status);
  });

  totalFilteredItems = computed(() => this.filteredSales().length);

  pagedSales = computed(() => {
    const start = this.currentPage() * this.itemsPerPage;
    return this.filteredSales().slice(start, start + this.itemsPerPage);
  });

  // MODAL DE CONFIRMACIÓN
  modalConfig = signal<{
    isOpen: boolean;
    title: string;
    message: string;
    action: 'completeSale' | 'cancelSale' | null;
    data: any;
  }>({
    isOpen: false,
    title: '',
    message: '',
    action: null,
    data: null
  });

  ngOnInit() {
    this.loadSales();
  }

  loadSales() {
    const user = this.authService.currentUser$();
    if (user) {
      this.loading.set(true);
      this.ventaService.getSalesByVendedor(user.id).subscribe({
        next: (data) => {
          const sorted = data.sort((a, b) => b.idVenta - a.idVenta);
          this.sales.set(sorted);
          this.calculateTotal(sorted);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    }
  }

  onPageChange(page: number) {
    this.currentPage.set(page - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  setStatus(status: string) {
    this.selectedStatus.set(status);
    this.currentPage.set(0);
  }

  calculateTotal(data: Sale[]) {
    // Solo sumamos las ventas REALIZADAS al total
    const total = data
      .filter(s => s.estadoVenta === 'REALIZADA')
      .reduce((acc, curr) => acc + curr.precio, 0);
    this.totalSales.set(total);
  }

  startEdit(sale: Sale) {
    this.editingId.set(sale.idVenta);
    this.newPrice = sale.precio;
  }

  savePrice(sale: Sale) {
    if (this.newPrice <= 0) {
      this.ns.error('El precio debe ser un valor positivo');
      return;
    }

    this.isProcessing.set(true);
    this.ventaService.updatePrecioVenta(sale.idVenta, this.newPrice, 'VENDEDOR').subscribe({
      next: () => {
        this.ns.success('Contraoferta enviada correctamente');
        this.isProcessing.set(false);
        this.editingId.set(null);
        this.loadSales();
      },
      error: () => {
        this.ns.error('Error al enviar la contraoferta');
        this.isProcessing.set(false);
      }
    });
  }

  completeSale(sale: Sale) {
    this.modalConfig.set({
      isOpen: true,
      title: 'Finalizar Venta',
      message: `¿Confirmas que la venta del ${sale.vehiculo.marca?.nombre} ${sale.vehiculo.modelo} ha sido finalizada con éxito? El vehículo ya no aparecerá disponible.`,
      action: 'completeSale',
      data: sale
    });
  }

  cancelSale(sale: Sale) {
    this.modalConfig.set({
      isOpen: true,
      title: 'Anular Operación',
      message: '¿Estás seguro de que deseas ANULAR la solicitud del cliente? La operación quedará registrada como anulada y el vehículo seguirá a la venta.',
      action: 'cancelSale',
      data: sale
    });
  }

  handleModalConfirm() {
    const config = this.modalConfig();
    if (!config.action) return;

    if (config.action === 'completeSale') {
      const sale = config.data as Sale;
      this.isProcessing.set(true);
      this.ventaService.completarVenta(sale.idVenta).subscribe({
        next: () => {
          this.ns.success('Venta finalizada con éxito');
          this.isProcessing.set(false);
          this.loadSales();
          this.closeConfirmModal();
        },
        error: () => {
          this.ns.error('Error al finalizar la venta');
          this.isProcessing.set(false);
          this.closeConfirmModal();
        }
      });
    } else if (config.action === 'cancelSale') {
      const sale = config.data as Sale;
      this.isProcessing.set(true);
      this.ventaService.anularVenta(sale.idVenta).subscribe({
        next: () => {
          this.ns.success('Operación anulada correctamente');
          this.isProcessing.set(false);
          this.loadSales();
          this.closeConfirmModal();
        },
        error: () => {
          this.ns.error('Error al anular la operación');
          this.isProcessing.set(false);
          this.closeConfirmModal();
        }
      });
    }
  }

  handleModalCancel() {
    this.closeConfirmModal();
  }

  private closeConfirmModal() {
    this.modalConfig.update(prev => ({ ...prev, isOpen: false, action: null, data: null }));
  }
}
