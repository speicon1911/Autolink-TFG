import { Component, OnInit, inject, signal } from '@angular/core';
import { FormatEnumPipe } from '../../../shared/pipes/format-enum.pipe';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Vehicle } from '../../../core/models/vehicle.model';
import { VehicleService } from '../../../core/services/vehicle.service';

@Component({
    selector: 'app-vehicle-details',
    standalone: true,
    imports: [CommonModule, RouterLink, FormatEnumPipe],
    template: `
    <div class="max-w-6xl mx-auto space-y-12 animate-fade-in py-8">
      <!-- Breadcrumb / Back -->
      <nav>
        <a routerLink="/" class="text-baltic-blue-400 hover:text-baltic-blue-300 flex items-center gap-2 font-black uppercase tracking-widest text-[10px] transition-colors group">
          <svg class="group-hover:-translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Volver al Catálogo
        </a>
      </nav>
    
      @if (vehicle()) {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Visuals Column -->
          <div class="space-y-6">
            <div class="aspect-[16/10] bg-white/5 backdrop-blur-xl rounded-3xl border border-baltic-blue-500/20 flex items-center justify-center text-dark-teal-700 relative overflow-hidden shadow-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-40"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
              @if (vehicle()?.verificado) {
                <div class="absolute top-8 left-8 bg-baltic-blue-500 text-white font-black px-4 py-2 rounded-full shadow-2xl flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  VEHÍCULO VERIFICADO
                </div>
              }
            </div>
            <div class="grid grid-cols-3 gap-6">
              @for (i of [1,2,3]; track i) {
                <div class="aspect-square bg-white/20 rounded-2xl border border-dark-teal-100 flex items-center justify-center text-dark-teal-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-60"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
              }
            </div>
          </div>
          <!-- Informacion Vehiculo -->
          <div class="space-y-10">
            <div class="space-y-2">
              @if (vehicle()?.marca) {
                <h2 class="text-baltic-blue-400 font-black uppercase tracking-widest text-sm">{{ vehicle()?.marca?.nombre | formatEnum }}</h2>
              }
              <h1 class="text-5xl font-black text-vehicle-teal tracking-tight">{{ vehicle()?.modelo }}</h1>
              <p class="text-3xl font-black text-baltic-blue-500 pt-4">{{ vehicle()?.precio | currency:'EUR' }}</p>
            </div>
            <div class="grid grid-cols-2 gap-6 bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-baltic-blue-500/20 shadow-xl">
              @if (vehicle()?.kilometraje !== undefined) {
                <div class="space-y-1">
                  <span class="text-baltic-blue-400 text-[10px] font-black uppercase tracking-widest">Kilometraje</span>
                  <p class="text-vehicle-teal font-bold text-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#70ABAF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-route-icon lucide-route"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>
                    {{ vehicle()?.kilometraje }} Km
                  </p>
                </div>
              }
              @if (vehicle()?.potencia !== undefined) {
                <div class="space-y-1">
                  <span class="text-baltic-blue-400 text-[10px] font-black uppercase tracking-widest">Potencia</span>
                  <p class="text-vehicle-teal font-bold text-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#70ABAF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-biceps-flexed-icon lucide-biceps-flexed"><path d="M12.409 13.017A5 5 0 0 1 22 15c0 3.866-4 7-9 7-4.077 0-8.153-.82-10.371-2.462-.426-.316-.631-.832-.62-1.362C2.118 12.723 2.627 2 10 2a3 3 0 0 1 3 3 2 2 0 0 1-2 2c-1.105 0-1.64-.444-2-1"/><path d="M15 14a5 5 0 0 0-7.584 2"/><path d="M9.964 6.825C8.019 7.977 9.5 13 8 15"/></svg>
                    {{ vehicle()?.potencia }} CV
                  </p>
                </div>
              }
              @if (vehicle()?.tipoVehiculo) {
                <div class="space-y-1">
                  <span class="text-baltic-blue-400 text-[10px] font-black uppercase tracking-widest">Tipo</span>
                  <p class="text-vehicle-teal font-bold text-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#70ABAF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-car-icon lucide-car"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                    {{ vehicle()?.tipoVehiculo | formatEnum }}
                  </p>
                </div>
              }
              @if (vehicle()?.combustible) {
                <div class="space-y-1">
                  <span class="text-baltic-blue-400 text-[10px] font-black uppercase tracking-widest">Combustible</span>
                  <p class="text-vehicle-teal font-bold text-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#70ABAF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-fuel-icon lucide-fuel"><path d="M3 22L15 22"/><path d="M4 9L14 9"/><path d="M14 22L14 11"/><path d="M15 6L14 6L14 11"/><path d="M4 22L4 7C4 5.34315 5.34315 4 7 4H11C12.6569 4 14 5.34315 14 7V22"/><path d="M18 10C18.5523 10 19 9.55228 19 9C19 8.44772 18.5523 8 18 8C17.4477 8 17 8.44772 17 9C17 9.55228 17.4477 10 18 10Z"/><path d="M14 13L16 13C17.1046 13 18 13.8954 18 15V22"/></svg>
                    {{ vehicle()?.combustible | formatEnum }}
                  </p>
                </div>
              }
              @if (vehicle()?.anioFabricacion) {
                <div class="space-y-1">
                  <span class="text-baltic-blue-400 text-[10px] font-black uppercase tracking-widest">Año</span>
                  <p class="text-vehicle-teal font-bold text-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#70ABAF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-icon lucide-calendar"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
                    {{ vehicle()?.anioFabricacion }}
                  </p>
                </div>
              }
              @if(vehicle()?.plazas){
                <div class="space-y-1">
                <span class="text-baltic-blue-400 text-[10px] font-black uppercase tracking-widest">Plazas</span>
                 <p class="text-vehicle-teal font-bold text-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#70ABAF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                {{ vehicle()?.plazas }}
                </p>
                </div>
                }
              @if(vehicle()?.color){
                <div class="space-y-1">
                <span class="text-baltic-blue-400 text-[10px] font-black uppercase tracking-widest">Color</span>
                 <p class="text-vehicle-teal font-bold text-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#70ABAF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-spray-can-icon lucide-spray-can"><path d="M3 3h.01"/><path d="M7 5h.01"/><path d="M11 7h.01"/><path d="M3 7h.01"/><path d="M7 9h.01"/><path d="M3 11h.01"/><rect width="4" height="4" x="15" y="5"/><path d="m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2"/><path d="m13 14 8-2"/><path d="m13 19 8-2"/></svg>
                {{ vehicle()?.color }}
                </p>
                </div>
              }
            </div>
            <div class="space-y-4">
              <button class="btn-primary w-full text-white font-black py-5 rounded-2xl transition-all shadow-2xl shadow-baltic-blue-600/30 active:scale-[0.98] flex items-center justify-center gap-3 group/buy">
                Contactar con el Vendedor
                <svg class="group-hover/buy:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
              </button>
            </div>
          </div>
        </div>
      }
    
      @if (!vehicle() && !loading()) {
        <div class="text-center py-40">
          <p class="text-dark-teal-600">No se ha podido cargar la información del vehículo.</p>
        </div>
      }
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

    constructor() {
        // Try to get vehicle from router state (fast)
        const navigation = this.router.currentNavigation();
        if (navigation?.extras.state?.['vehicle']) {
            this.vehicle.set(navigation.extras.state['vehicle']);
            this.loading.set(false);
        }
    }

    ngOnInit() {
        if (!this.vehicle()) {
            // Fallback: Fetch by looking into available list since we don't have GET /vehiculos/:id
            const id = Number(this.route.snapshot.paramMap.get('id'));
            this.vehicleService.getVehiculoById(id).subscribe({
                next: (vehicle) => {
                    if (vehicle) {
                        this.vehicle.set(vehicle);
                    }
                    this.loading.set(false);
                },
                error: () => this.loading.set(false)
            });
        }
    }
}
