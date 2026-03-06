import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Vehicle } from '../../../core/models/vehicle.model';
import { VehicleService } from '../../../core/services/vehicle.service';

@Component({
    selector: 'app-vehicle-details',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="max-w-6xl mx-auto space-y-12 animate-fade-in py-8">
      <!-- Breadcrumb / Back -->
      <nav>
          <a routerLink="/" class="text-slate-500 hover:text-blue-500 flex items-center gap-2 font-bold uppercase tracking-widest text-xs transition-colors group">
              <svg class="group-hover:-translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Volver al Catálogo
          </a>
      </nav>

      <div *ngIf="vehicle()" class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Visuals Column -->
        <div class="space-y-6">
          <div class="aspect-[16/10] bg-slate-900 rounded-3xl border border-slate-800 flex items-center justify-center text-slate-700 relative overflow-hidden shadow-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-20"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
              <div *ngIf="vehicle()?.verificado" class="absolute top-8 left-8 bg-blue-600 text-white font-black px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  VEHÍCULO VERIFICADO
              </div>
          </div>
          
          <div class="grid grid-cols-3 gap-6">
            <div *ngFor="let i of [1,2,3]" class="aspect-square bg-slate-900/50 rounded-2xl border border-slate-800 flex items-center justify-center text-slate-800">
                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-40"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </div>
          </div>
        </div>

        <!-- Info Column -->
        <div class="space-y-10">
          <div class="space-y-2">
            <h2 *ngIf="vehicle()?.marca" class="text-blue-500 font-black uppercase tracking-widest text-sm">{{ vehicle()?.marca?.nombre }}</h2>
            <h1 class="text-5xl font-black text-white tracking-tight">{{ vehicle()?.modelo }}</h1>
            <p class="text-3xl font-black text-white pt-4">{{ vehicle()?.precio | currency:'EUR' }}</p>
          </div>

          <div class="grid grid-cols-2 gap-6 bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
            <div *ngIf="vehicle()?.kilometraje !== undefined" class="space-y-1">
                <span class="text-slate-500 text-[10px] font-black uppercase tracking-widest">Kilometraje</span>
                <p class="text-white font-bold text-lg flex items-center gap-2">
                    <svg class="text-blue-500" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {{ vehicle()?.kilometraje }} Km
                </p>
            </div>
            <div *ngIf="vehicle()?.potencia !== undefined" class="space-y-1">
                <span class="text-slate-500 text-[10px] font-black uppercase tracking-widest">Potencia</span>
                <p class="text-white font-bold text-lg flex items-center gap-2">
                    <svg class="text-blue-500" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    {{ vehicle()?.potencia }} CV
                </p>
            </div>
            <div *ngIf="vehicle()?.tipoVehiculo" class="space-y-1">
                <span class="text-slate-500 text-[10px] font-black uppercase tracking-widest">Tipo</span>
                <p class="text-white font-bold text-lg flex items-center gap-2">
                    <svg class="text-blue-500" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                    {{ vehicle()?.tipoVehiculo }}
                </p>
            </div>
            <div *ngIf="vehicle()?.fechaFabricacion" class="space-y-1">
                <span class="text-slate-500 text-[10px] font-black uppercase tracking-widest">Año</span>
                <p class="text-white font-bold text-lg flex items-center gap-2">
                    <svg class="text-blue-500" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {{ vehicle()?.fechaFabricacion | date:'yyyy' }}
                </p>
            </div>
          </div>

          <div class="space-y-4">
            <button class="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl transition-all shadow-2xl shadow-blue-600/30 active:scale-[0.98] flex items-center justify-center gap-3 group/buy">
                Contactar con el Vendedor
                <svg class="group-hover/buy:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
            </button>
            <button class="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-5 rounded-2xl transition-all active:scale-[0.98]">
                Financiar desde 199€/mes
            </button>
          </div>
        </div>
      </div>
      
      <div *ngIf="!vehicle() && !loading()" class="text-center py-40">
          <p class="text-slate-500">No se ha podido cargar la información del vehículo.</p>
      </div>
    </div>
  `,
    styles: [`
    .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
  `]
})
export class VehicleDetailsComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private vehicleService = inject(VehicleService);

    vehicle = signal<Vehicle | null>(null);
    loading = signal(true);

    ngOnInit() {
        // Try to get vehicle from router state (fast)
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras.state?.['vehicle']) {
            this.vehicle.set(navigation.extras.state['vehicle']);
            this.loading.set(false);
        } else {
            // Fallback: Fetch by looking into available list since we don't have GET /vehiculos/:id
            const id = Number(this.route.snapshot.paramMap.get('id'));
            this.vehicleService.getVehiculosDisponibles().subscribe({
                next: (vehicles) => {
                    const found = vehicles.find(v => v.idVehiculo === id);
                    if (found) {
                        this.vehicle.set(found);
                    }
                    this.loading.set(false);
                },
                error: () => this.loading.set(false)
            });
        }
    }
}
