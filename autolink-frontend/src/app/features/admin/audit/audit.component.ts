import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentaService } from '../../../core/services/venta.service';
import { Sale } from '../../../core/models/sale.model';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
    selector: 'app-admin-audit',
    standalone: true,
    imports: [CommonModule, PaginationComponent],
    template: `
    <div class="space-y-6 animate-fade-in">
      <header>
        <h1 class="text-3xl font-black text-content-primary">Auditoría de Ventas</h1>
        <p class="text-content-secondary">Registro histórico de todas las transacciones de la plataforma</p>
      </header>
    
      @if (loading()) {
        <div class="flex justify-center py-20">
          <div class="w-12 h-12 border-4 border-action-primary/20 border-t-action-primary rounded-full animate-spin"></div>
        </div>
      }
    
      @if (!loading()) {
        <!-- Status Filter -->
        <div class="flex flex-wrap items-center gap-2 mb-6">
          <button (click)="setStatus('TODAS')" 
            [class]="selectedStatus() === 'TODAS' ? 'px-4 py-2 bg-action-primary text-surface-base rounded-xl font-black text-xs transition-all' : 'px-4 py-2 bg-surface-card text-content-secondary hover:text-action-primary rounded-xl font-bold text-xs transition-all border border-white/5'">
            TODAS
          </button>
          <button (click)="setStatus('REALIZADA')" 
            [class]="selectedStatus() === 'REALIZADA' ? 'px-4 py-2 bg-emerald-500 text-surface-base rounded-xl font-black text-xs transition-all' : 'px-4 py-2 bg-surface-card text-content-secondary hover:text-emerald-500 rounded-xl font-bold text-xs transition-all border border-white/5'">
            REALIZADAS
          </button>
          <button (click)="setStatus('EN_PROGRESO')" 
            [class]="selectedStatus() === 'EN_PROGRESO' ? 'px-4 py-2 bg-amber-500 text-surface-base rounded-xl font-black text-xs transition-all' : 'px-4 py-2 bg-surface-card text-content-secondary hover:text-amber-500 rounded-xl font-bold text-xs transition-all border border-white/5'">
            PENDIENTES
          </button>
          <button (click)="setStatus('ANULADA')" 
            [class]="selectedStatus() === 'ANULADA' ? 'px-4 py-2 bg-rose-500 text-surface-base rounded-xl font-black text-xs transition-all' : 'px-4 py-2 bg-surface-card text-content-secondary hover:text-rose-500 rounded-xl font-bold text-xs transition-all border border-white/5'">
            ANULADAS
          </button>
        </div>
        <div class="bg-surface-card backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-surface-base border-b border-white/5">
                <tr>
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-content-muted">ID Venta</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-content-muted">Fecha</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-content-muted">Cliente</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-content-muted">Vehículo</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-content-muted">Estado</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-content-muted text-right">Monto</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                @for (s of pagedSales(); track s.idVenta) {
                  <tr class="hover:bg-white/5 transition-colors group">
                    <td class="px-6 py-4 text-content-primary font-bold">#{{ s.idVenta }}</td>
                    <td class="px-6 py-4 text-content-secondary text-sm italic">{{ s.fecha | date:'shortDate' }}</td>
                    <td class="px-6 py-4">
                      <p class="text-content-primary text-sm font-black">{{ s.cliente.nombre }} {{ s.cliente.apellidos }}</p>
                      <p class="text-content-muted text-[10px] font-bold">{{ s.cliente.correo }}</p>
                    </td>
                    <td class="px-6 py-4 border-l border-white/5">
                      <p class="text-content-primary text-sm font-black">{{ s.vehiculo.marca?.nombre }} {{ s.vehiculo.modelo }}</p>
                      <p class="text-content-muted text-[10px] uppercase font-bold tracking-widest">{{ s.vehiculo.tipoVehiculo }}</p>
                    </td>
                    <td class="px-6 py-4">
                   <span [ngClass]="{
                     'text-emerald-500 bg-emerald-500/10 border-emerald-500/20': s.estadoVenta === 'REALIZADA',
                     'text-amber-500 bg-amber-500/10 border-amber-500/20': s.estadoVenta === 'EN_PROGRESO',
                     'text-rose-500 bg-rose-500/10 border-rose-500/20': s.estadoVenta === 'ANULADA'
                   }" class="px-2 py-0.5 rounded-full text-[10px] font-black border uppercase">
                        {{ s.estadoVenta }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <span class="text-lg font-black text-action-primary">{{ s.precio | currency:'EUR' }}</span>
                    </td>
                  </tr>
                }
              </tbody>
              <tfoot class="bg-surface-base border-t border-white/5">
                <tr>
                  <td colspan="5" class="px-6 py-4 text-right text-content-muted font-black uppercase tracking-widest text-[10px]">Volumen Total</td>
                  <td class="px-6 py-4 text-right text-xl font-black text-action-primary">{{ totalVolume() | currency:'EUR' }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
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
    `,
    styles: [`
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class AdminAuditComponent implements OnInit {
    private ventaService = inject(VentaService);

    sales = signal<Sale[]>([]);
    loading = signal(true);
    selectedStatus = signal<string>('TODAS');

    // Pagination
    currentPage = signal(0);
    itemsPerPage = 10;

    filteredSales = computed(() => {
        const status = this.selectedStatus();
        const allSales = this.sales();
        if (status === 'TODAS') return allSales;
        return allSales.filter(s => s.estadoVenta === status);
    });

    totalFilteredItems = computed(() => this.filteredSales().length);

    pagedSales = computed(() => {
        const start = this.currentPage() * this.itemsPerPage;
        return this.filteredSales().slice(start, start + this.itemsPerPage);
    });

    ngOnInit() {
        this.cargarVentas();
    }

    cargarVentas() {
        this.ventaService.getAllVentas().subscribe({
            next: (data) => {
                this.sales.set(data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    onPageChange(page: number) {
        this.currentPage.set(page - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setStatus(status: string) {
        this.selectedStatus.set(status);
        this.currentPage.set(0);
    }

    totalVolume() {
        return this.sales()
            .filter(s => s.estadoVenta === 'REALIZADA')
            .reduce((acc, current) => acc + current.precio, 0);
    }
}
