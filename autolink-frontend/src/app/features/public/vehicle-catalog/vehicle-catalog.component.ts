import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleService } from '../../../core/services/vehicle.service';
import { Vehicle, Marca, TipoVehiculo } from '../../../core/models/vehicle.model';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-vehicle-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  template: `
    <div class="space-y-8 animate-fade-in px-4 sm:px-0">
      <header class="text-center space-y-4">
        <h1 class="text-4xl md:text-5xl font-black tracking-tight text-white">
          Encuentra tu próximo <span class="text-blue-500">vehículo</span>
        </h1>
        <p class="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
          Explora nuestro catálogo exclusivo de vehículos verificados y listos para la carretera.
          Filtra por modelo, potencia, kilometraje y más.
        </p>
      </header>
    
      <!-- Filters Section -->
      <section class="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
    
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Marca</label>
            <select [(ngModel)]="filtros.marca" (change)="aplicarFiltros()"
              class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
              <option value="">Todas las marcas</option>
              @for (m of marcas(); track m) {
                <option [value]="m?.nombre">{{ m?.nombre }}</option>
              }
            </select>
          </div>
    
          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Modelo</label>
            <input type="text" [(ngModel)]="filtros.modelo" (input)="aplicarFiltros()"
              placeholder="Ej: Corolla"
              class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
            </div>
    
            <div class="space-y-1">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Tipo</label>
              <select [(ngModel)]="filtros.tipo" (change)="aplicarFiltros()"
                class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                <option value="">Cualquier tipo</option>
                @for (t of tipos; track t) {
                  <option [value]="t">{{ t }}</option>
                }
              </select>
            </div>
    
            <div class="space-y-1">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Precio Máx (€)</label>
              <input type="number" [(ngModel)]="filtros.maxPrecio" (input)="aplicarFiltros()"
                placeholder="Ej: 30000"
                class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
              </div>
    
              <div class="space-y-1">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Km Máximo</label>
                <input type="number" [(ngModel)]="filtros.maxKm" (input)="aplicarFiltros()"
                  placeholder="Ej: 150000"
                  class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                </div>
    
                <div class="space-y-1">
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Potencia Mín (CV)</label>
                  <input type="number" [(ngModel)]="filtros.minPotencia" (input)="aplicarFiltros()"
                    placeholder="Ej: 120"
                    class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                  </div>
    
                  <div class="space-y-1">
                    <label class="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Plazas</label>
                    <input type="number" [(ngModel)]="filtros.plazas" (input)="aplicarFiltros()"
                      placeholder="Mínimo de plazas"
                      class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                    </div>
    
                    <div class="flex items-end pb-3">
                      <button (click)="resetFiltros()" class="text-blue-500 hover:text-blue-400 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                        Limpiar Filtros
                      </button>
                    </div>
                  </div>
                </section>
    
                <!-- Results Grid -->
                @if (loading()) {
                  <div class="flex flex-col items-center justify-center py-32 space-y-4">
                    <div class="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    <p class="text-slate-500 font-bold animate-pulse">Buscando los mejores vehículos...</p>
                  </div>
                }
    
                @if (!loading() && vehiculos().length === 0) {
                  <div class="text-center py-20 space-y-4 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
                    <div class="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </div>
                    <p class="text-slate-400 text-xl font-medium">No se encontraron vehículos que coincidan con tus filtros.</p>
                  </div>
                }
    
                @if (!loading() && vehiculos().length > 0) {
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    @for (v of paginatedVehiculos(); track v) {
                      <div
                        class="group bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 transform hover:-translate-y-2">
                        <div class="aspect-[16/10] bg-slate-800 relative group-hover:scale-105 transition-transform duration-700">
                          <div class="absolute inset-0 flex items-center justify-center text-slate-700 opacity-20 group-hover:opacity-40 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                          </div>
                          @if (v.verificado) {
                            <div class="absolute top-5 right-5 bg-white text-blue-600 text-[10px] font-black px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5 z-10 border border-blue-100">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                              VERIFICADO
                            </div>
                          }
                        </div>
                        <div class="p-6 space-y-5">
                          <div class="space-y-1">
                            <div class="flex justify-between items-start gap-4">
                              <h3 class="text-xl font-black text-white group-hover:text-blue-400 transition-colors leading-tight">
                                {{ v.modelo }}
                              </h3>
                              <span class="text-2xl font-black text-blue-500">{{ v.precio | currency:'EUR':'symbol':'1.0-0' }}</span>
                            </div>
                            <p class="text-slate-500 text-sm font-medium tracking-tight bg-slate-800/50 w-fit px-2 py-0.5 rounded shadow-sm">
                              {{ v.tipoVehiculo }} · {{ v.color }}
                            </p>
                          </div>
                          <div class="grid grid-cols-2 gap-y-3 gap-x-6 border-y border-slate-800/50 py-4">
                            @if (v.potencia) {
                              <div class="flex items-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                <div class="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                                </div>
                                {{ v.potencia }} CV
                              </div>
                            }
                            @if (v.kilometraje !== undefined) {
                              <div class="flex items-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                <div class="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                </div>
                                {{ v.kilometraje }} Km
                              </div>
                            }
                            @if (v.plazas) {
                              <div class="flex items-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                <div class="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v5"/><path d="M10 11V9a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M2 9v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9"/><path d="M20 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v5"/></svg>
                                </div>
                                {{ v.plazas }} Plazas
                              </div>
                            }
                            @if (v.fechaFabricacion) {
                              <div class="flex items-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                <div class="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                </div>
                                {{ v.fechaFabricacion | date:'yyyy' }}
                              </div>
                            }
                          </div>
                          <button (click)="verDetalles(v)"
                            class="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-3 group/btn text-sm uppercase tracking-widest">
                            Ver Detalles
                            <svg class="group-hover/btn:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                          </button>
                        </div>
                      </div>
                    }
                  </div>
                  
                  <div class="pt-8">
                    <app-pagination
                      [totalItems]="vehiculos().length"
                      [itemsPerPage]="itemsPerPage"
                      [currentPage]="currentPage"
                      (pageChange)="onPageChange($event)">
                    </app-pagination>
                  </div>
                }
              </div>
    `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class VehicleCatalogComponent implements OnInit {
  private vehicleService = inject(VehicleService);
  private router = inject(Router);
  private ns = inject(NotificationService);

  vehiculos = signal<Vehicle[]>([]);
  paginatedVehiculos = signal<Vehicle[]>([]);
  marcas = signal<Marca[]>([]);
  loading = signal(true);
  tipos = Object.values(TipoVehiculo);

  currentPage = 1;
  itemsPerPage = 6;

  filtros = {
    marca: '',
    modelo: '',
    tipo: '',
    maxPrecio: null as number | null,
    maxKm: null as number | null,
    minPotencia: null as number | null,
    plazas: null as number | null,
    disponible: true
  };

  ngOnInit() {
    this.cargarMarcas();
    this.cargarVehiculos();
  }

  cargarMarcas() {
    this.vehicleService.getMarcas().subscribe({
      next: (data) => {
        const sorted = [...data].sort((a, b) => a.nombre.localeCompare(b.nombre));
        this.marcas.set(sorted);
      },
      error: () => console.error('Error cargando marcas')
    });
  }

  cargarVehiculos() {
    this.loading.set(true);
    this.vehicleService.getVehiculosDisponibles().subscribe({
      next: (data) => {
        this.vehiculos.set(data);
        this.currentPage = 1;
        this.updatePaginatedVehiculos();
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        console.error('Error cargando vehículos');
      }
    });
  }

  aplicarFiltros() {
    this.loading.set(true);
    this.vehicleService.buscarVehiculos(this.filtros).subscribe({
      next: (data) => {
        this.vehiculos.set(data);
        this.currentPage = 1;
        this.updatePaginatedVehiculos();
        this.loading.set(false);
      },
      error: (err: any) => {
        this.vehiculos.set([]);
        this.paginatedVehiculos.set([]);
        this.loading.set(false);
        const errorMsg = err?.error?.message || 'No se han encontrado vehículos con estos filtros';
        this.ns.error(errorMsg);
      }
    });
  }

  resetFiltros() {
    this.filtros = {
      marca: '',
      modelo: '',
      tipo: '',
      maxPrecio: null,
      maxKm: null,
      minPotencia: null,
      plazas: null,
      disponible: true
    };
    this.cargarVehiculos();
  }

  verDetalles(v: Vehicle) {
    this.router.navigate(['/vehiculo', v.idVehiculo], { state: { vehicle: v } });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePaginatedVehiculos();
  }

  private updatePaginatedVehiculos() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedVehiculos.set(this.vehiculos().slice(startIndex, endIndex));
  }
}
