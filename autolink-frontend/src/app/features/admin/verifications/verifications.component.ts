import { Component, OnInit, inject, signal } from '@angular/core';

import { VehicleService } from '../../../core/services/vehicle.service';
import { Vehicle } from '../../../core/models/vehicle.model';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-admin-verifications',
  standalone: true,
  imports: [],
  template: `
    <div class="space-y-6 animate-fade-in">
      <header>
        <h1 class="text-3xl font-black text-pitch-black-50">Verificación de Vehículos</h1>
        <p class="text-baltic-blue-400">Revisa y certifica el estado de los vehículos en stock</p>
      </header>
    
      @if (loading()) {
        <div class="flex justify-center py-20">
          <div class="w-12 h-12 border-4 border-baltic-blue-500/20 border-t-baltic-blue-500 rounded-full animate-spin"></div>
        </div>
      }
    
      @if (!loading() && pendingVehicles().length === 0) {
        <div class="text-center py-20 bg-white/5 backdrop-blur-sm rounded-3xl border border-dashed border-dark-teal-800">
          <p class="text-baltic-blue-300/60">No hay vehículos pendientes de verificación.</p>
        </div>
      }
    
      @if (!loading() && pendingVehicles().length > 0) {
        <div class="grid gap-4">
          @for (v of pendingVehicles(); track v) {
            <div
              class="bg-white/5 backdrop-blur-md border-[3px] border-pitch-black-950 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-baltic-blue-500 transition-all shadow-xl">
              <div class="flex items-center gap-5">
                <div class="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-dark-teal-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                </div>
                <div class="space-y-1">
                  <h3 class="text-pitch-black-50 font-bold text-lg">{{ v.modelo }}</h3>
                  <p class="text-baltic-blue-300/60 text-sm">Vendedor: <span class="text-pitch-black-50/80 font-bold tracking-tight uppercase">{{ v.vendedor?.nombre }}</span></p>
                  <p class="text-[10px] text-baltic-blue-400 font-bold uppercase tracking-widest">ID: #{{ v.idVehiculo }} | {{ v.kilometraje }} Km | {{ v.potencia }} CV</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <button (click)="verify(v.idVehiculo, false)" class="px-5 py-2.5 rounded-xl border border-rose-500/50 text-rose-600 font-bold hover:bg-rose-50 transition-all active:scale-95">
                  Rechazar
                </button>
                <button (click)="verify(v.idVehiculo, true)" class="px-5 py-2.5 rounded-xl bg-baltic-blue-500 text-white font-bold hover:bg-baltic-blue-600 shadow-lg shadow-baltic-blue-500/20 transition-all active:scale-95 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Verificar
                </button>
              </div>
            </div>
          }
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

  ngOnInit() {
    this.cargarPendientes();
  }

  cargarPendientes() {
    this.loading.set(true);
    this.vehicleService.getVehiculosDisponibles().subscribe({
      next: (data) => {
        // Filtramos por no verificados
        this.pendingVehicles.set(data.filter(v => !v.verificado));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  verify(id: number, status: boolean) {
    this.vehicleService.verificarVehiculo(id, status).subscribe({
      next: () => {
        this.ns.success(status ? 'Vehículo verificado con éxito' : 'Vehículo rechazado');
        this.cargarPendientes();
      }
    });
  }
}
