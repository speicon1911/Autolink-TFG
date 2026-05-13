import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleService } from '../../../core/services/vehicle.service';
import { Vehicle, EstadoVerificacion } from '../../../core/models/vehicle.model';
import { NotificationService } from '../../../core/services/notification.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-admin-verifications',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  template: `
    <div class="space-y-6 animate-fade-in">
      <header>
        <h1 class="text-3xl font-black text-content-primary">Verificación de Vehículos</h1>
        <p class="text-content-secondary">Revisa y certifica el estado de los vehículos en stock</p>
      </header>
    
      @if (loading()) {
        <div class="flex justify-center py-20">
          <div class="w-12 h-12 border-4 border-action-primary/20 border-t-action-primary rounded-full animate-spin"></div>
        </div>
      }
    
      @if (!loading() && pendingVehicles().length === 0) {
        <div class="text-center py-20 bg-surface-card backdrop-blur-sm rounded-3xl border border-dashed border-white/10">
          <p class="text-content-muted">No hay vehículos pendientes de verificación.</p>
        </div>
      }
    
      @if (!loading() && pendingVehicles().length > 0) {
        <div class="grid gap-4">
          @for (v of pendingVehicles(); track v.idVehiculo) {
            <div
              class="bg-surface-card backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-action-primary/30 transition-all shadow-xl">
              <div class="flex items-center gap-5">
                <div class="w-16 h-16 bg-surface-base rounded-2xl flex items-center justify-center text-action-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                </div>
                <div class="space-y-1">
                  <h3 class="text-content-primary font-bold text-lg">{{ v.modelo }}</h3>
                  <p class="text-content-secondary text-sm">Vendedor: <span class="text-action-primary font-bold uppercase">{{ v.vendedor?.nombre }}</span></p>
                  <p class="text-[10px] text-content-muted font-bold uppercase tracking-widest">ID: #{{ v.idVehiculo }} | {{ v.kilometraje }} Km | {{ v.potencia }} CV</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <button (click)="verify(v.idVehiculo, false)" [disabled]="isProcessing()" class="px-5 py-2.5 rounded-xl border border-rose-500/30 text-rose-500 font-bold hover:bg-rose-500/5 transition-all active:scale-95 disabled:opacity-50">
                  Rechazar
                </button>
                <button (click)="verify(v.idVehiculo, true)" [disabled]="isProcessing()" class="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:opacity-90 shadow-lg shadow-emerald-600/20 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50">
                  @if (isProcessing()) {
                    <div class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  }
                  Verificar
                </button>
              </div>
            </div>
          }
        </div>
    
        <div class="pt-6 border-t border-white/5">
          <app-pagination
            [totalItems]="totalItems()"
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
export class AdminVerificationsComponent implements OnInit {
  private vehicleService = inject(VehicleService);
  private ns = inject(NotificationService);

  pendingVehicles = signal<Vehicle[]>([]);
  loading = signal(true);
  isProcessing = signal(false);

  // PAGINACIÓN
  totalItems = signal(0);
  currentPage = signal(0);
  itemsPerPage = 10;

  ngOnInit() {
    this.cargarPendientes();
  }

  cargarPendientes() {
    this.loading.set(true);
    // Usamos buscarVehiculos con filtro de no verificado
    const filtros = { verificado: EstadoVerificacion.PENDIENTE };

    this.vehicleService.buscarVehiculos(filtros, this.currentPage(), this.itemsPerPage).subscribe({
      next: (response) => {
        this.pendingVehicles.set(response.content || []);

        // Detección robusta del total de elementos
        const total = response.page?.totalElements ?? response.totalElements ?? response.content?.length ?? 0;
        this.totalItems.set(total);

        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  verify(id: number, approved: boolean) {
    this.isProcessing.set(true);
    const status = approved ? EstadoVerificacion.VERIFICADO : EstadoVerificacion.RECHAZADO;
    this.vehicleService.verificarVehiculo(id, status).subscribe({
      next: () => {
        this.ns.success(status ? 'Vehículo verificado con éxito' : 'Vehículo rechazado');
        this.isProcessing.set(false);
        this.cargarPendientes();
      },
      error: () => {
        this.ns.error('Error al procesar la verificación');
        this.isProcessing.set(false);
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage.set(page - 1);
    this.cargarPendientes();
  }
}
