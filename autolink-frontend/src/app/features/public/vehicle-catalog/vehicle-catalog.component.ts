import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormatEnumPipe } from '../../../shared/pipes/format-enum.pipe';
import { CommonModule } from '@angular/common';
import { VehicleService } from '../../../core/services/vehicle.service';
import { Vehicle, Marca, TipoVehiculo, CombustibleVehiculo, EtiquetaMedioambiental, EstadoVerificacion } from '../../../core/models/vehicle.model';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { ChatService } from '../../../core/services/chat.service';

@Component({
  selector: 'app-vehicle-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, FormatEnumPipe],
  template: `
    <div class="animate-fade-in px-4 lg:px-0">
      <header class="text-center space-y-4 mb-12">
        <h1 class="text-4xl md:text-5xl font-black tracking-tight text-content-primary">
          Encuentra tu próximo <span class="text-action-primary">vehículo</span>
        </h1>
        <p class="text-content-secondary max-w-2xl mx-auto text-lg leading-relaxed">
          Explora nuestro catálogo exclusivo de vehículos verificados y listos para la carretera.
          Filtra por modelo, potencia, kilometraje y más.
        </p>
      </header>
 
      <div class="flex flex-col lg:flex-row gap-8 relative">
        <!-- Desktop Sidebar (Sticky) -->
        <aside class="hidden lg:block w-80 shrink-0">
          <div class="sticky top-28 space-y-6">
            <div class="bg-surface-card backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
              <div class="absolute top-0 left-0 w-1 h-full bg-action-primary"></div>
              <h2 class="text-action-primary font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                Filtros de Búsqueda
              </h2>
              
              <ng-container *ngTemplateOutlet="filtersList"></ng-container>
 
              <div class="mt-8 pt-6 border-t border-white/5">
                <button (click)="resetFiltros()" class="w-full text-action-primary hover:opacity-80 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                  Limpiar Filtros
                </button>
              </div>
            </div>
          </div>
        </aside>
 
        <!-- Mobile Filter Button (Fixed at top of list) -->
        <div class="lg:hidden sticky top-[4.5rem] z-30 bg-surface-base/80 backdrop-blur-md py-4 mb-4 border-b border-white/5">
          <button (click)="toggleMobileFilters()" 
            class="w-full bg-action-primary text-surface-base font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            Filtros
            @if (tieneFiltrosActivos) {
              <span class="w-2 h-2 bg-surface-base rounded-full animate-pulse"></span>
            }
          </button>
        </div>
 
        <!-- Catalog Content -->
        <div class="flex-1 space-y-8">
          <!-- Results Grid -->
          @if (loading()) {
            <div class="flex flex-col items-center justify-center py-32 space-y-4">
              <div class="w-16 h-16 border-4 border-action-primary/20 border-t-action-primary rounded-full animate-spin"></div>
              <p class="text-action-primary font-bold animate-pulse">Buscando los mejores vehículos...</p>
            </div>
          }
 
          @if (!loading() && vehiculos().length === 0) {
            <div class="text-center py-20 space-y-4 bg-surface-card/50 backdrop-blur-sm rounded-3xl border border-dashed border-white/10">
              <div class="w-20 h-20 bg-action-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-action-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              @if (tieneFiltrosActivos) {
                <p class="text-content-primary text-xl font-medium opacity-80">No se encontraron vehículos que coincidan con tus filtros.</p>
                <button (click)="resetFiltros()" class="text-action-primary font-bold hover:underline">Limpiar todos los filtros</button>
              } @else {
                <p class="text-content-primary text-xl font-medium opacity-80">No hay vehículos disponibles en este momento.</p>
                <p class="text-content-secondary text-sm">Vuelve a consultar más tarde para ver nuevas incorporaciones.</p>
              }
            </div>
          }
 
          @if (!loading() && vehiculos().length > 0) {
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              @for (v of vehiculos(); track v.idVehiculo) {
                <div
                  class="group bg-surface-card backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden hover:border-action-primary transition-all duration-500 transform hover:-translate-y-2 shadow-2xl">
                  <div class="aspect-[16/10] bg-surface-base relative overflow-hidden">
                    @if (v.imagenes && v.imagenes.length > 0) {
                      <img [src]="v.imagenes[0].url" 
                        class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        alt="Vehículo">
                    } @else {
                      <div class="absolute inset-0 flex items-center justify-center text-content-muted/40 group-hover:scale-110 transition-transform duration-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                      </div>
                    }
                    
                    @if (v.verificado === 'VERIFICADO') {
                      <div class="absolute top-5 right-5 bg-status-success text-surface-base text-[10px] font-black px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5 z-10 transition-transform duration-300 group-hover:scale-105">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        VERIFICADO
                      </div>
                    }

                    <!-- Etiqueta DGT -->
                    <div [class]="'absolute top-5 left-5 px-3 py-1.5 rounded-lg text-[9px] font-black shadow-xl z-10 flex items-center gap-1.5 transition-all duration-300 group-hover:scale-110 ' + getEtiquetaInfo(v.etiquetaMedioambiental).color + ' ' + getEtiquetaInfo(v.etiquetaMedioambiental).textColor">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                      {{ getEtiquetaInfo(v.etiquetaMedioambiental).text }}
                    </div>
                  </div>
                  <div class="p-5 space-y-4">
                    <div class="space-y-1">
                      <div class="flex justify-between items-start gap-4">
                        <h2 class="text-lg font-black text-content-primary group-hover:text-action-primary transition-colors leading-tight">
                          @if (v.marca) {
                            <span class="text-action-primary text-[10px] block mb-1 uppercase tracking-widest">{{ v.marca.nombre | formatEnum }}</span>
                          }
                          {{ v.modelo }}
                        </h2>
                        <span class="text-xl font-black text-action-primary whitespace-nowrap">{{ v.precio | currency:'EUR':'symbol':'1.0-0' }}</span>
                      </div>
                      <p class="text-content-secondary text-[10px] font-bold tracking-tight uppercase">
                        {{ v.tipoVehiculo | formatEnum }} · {{ v.color }}
                      </p>
                    </div>
                    <div class="grid grid-cols-2 gap-3 border-y border-white/5 py-3">
                      @if (v.potencia) {
                        <div class="flex items-center gap-2 text-content-secondary text-[10px] font-bold uppercase tracking-widest">
                          <div class="w-6 h-6 rounded bg-action-primary/10 flex items-center justify-center text-action-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>
                          </div>
                          {{ v.potencia }} CV
                        </div>
                      }
                      @if (v.ciudad) {
                        <div class="flex items-center gap-2 text-content-secondary text-[10px] font-bold uppercase tracking-widest">
                          <div class="w-6 h-6 rounded bg-action-primary/10 flex items-center justify-center text-action-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                          </div>
                          {{ v.ciudad }}
                        </div>
                      }
                    </div>

                    <button (click)="verDetalles(v)"
                      class="btn-primary w-full font-black py-3 rounded-xl transition-all shadow-xl shadow-action-primary/20 active:scale-[0.98] flex items-center justify-center gap-3 group/btn text-[10px] uppercase tracking-widest">
                      Ver Detalles
                      <svg class="group-hover/btn:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </button>
                  </div>
                </div>
              }
            </div>
            
            <div class="pt-8">
              <app-pagination
                [totalItems]="totalItems()"
                [itemsPerPage]="itemsPerPage"
                [currentPage]="currentPage() + 1"
                (pageChange)="onPageChange($event)">
              </app-pagination>
            </div>
          }
        </div>
      </div>
    </div>
 
    <!-- Mobile Drawer -->
    @if (showMobileFilters()) {
      <div class="fixed inset-0 z-[60] lg:hidden">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-surface-base/80 backdrop-blur-md animate-fade-in" (click)="toggleMobileFilters()"></div>
        
        <!-- Drawer Panel -->
        <div class="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-surface-card border-r border-white/10 p-6 flex flex-col shadow-2xl animate-slide-in">
          <div class="flex justify-between items-center mb-8">
            <h2 class="text-xl font-black text-content-primary">Filtros</h2>
            <button (click)="toggleMobileFilters()" class="text-action-primary p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
 
          <div class="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
            <ng-container *ngTemplateOutlet="filtersList"></ng-container>
          </div>
 
          <div class="mt-auto pt-6 border-t border-white/10 space-y-4">
            <button (click)="aplicarFiltros()"
              class="w-full bg-action-primary text-surface-base font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3">
              Ver Resultados
              <span class="bg-surface-base/20 px-2 py-0.5 rounded-lg text-xs">{{ totalItems() }}</span>
            </button>
            <button (click)="resetFiltros()" class="w-full text-action-primary text-xs font-black uppercase tracking-widest py-2">
              Limpiar Todo
            </button>
          </div>
        </div>
      </div>
    }
 
    <!-- Shared Filters Template -->
    <!-- Shared Filters Template -->
    <ng-template #filtersList>
      <div class="space-y-6">
        <div class="space-y-1">
          <label for="marca-select" class="text-[10px] font-black uppercase tracking-widest text-action-primary ml-1">Marca</label>
          <select id="marca-select" [(ngModel)]="filtros.marca" (change)="onFiltrosChange()"
            class="w-full bg-surface-base border border-white/5 rounded-xl px-4 py-3 text-content-primary focus:ring-2 focus:ring-action-primary outline-none transition-all cursor-pointer">
            <option value="" class="bg-surface-card">Todas las marcas</option>
            @for (m of marcas(); track m) {
              <option [value]="m?.nombre" class="bg-surface-card">{{ m?.nombre | formatEnum }}</option>
            }
          </select>
        </div>
 
        <div class="space-y-1">
          <label for="modelo-input" class="text-[10px] font-black uppercase tracking-widest text-action-primary ml-1">Modelo</label>
          <input id="modelo-input" type="text" [(ngModel)]="filtros.modelo" (input)="onFiltrosChange()"
            placeholder="Ej: Golf"
            class="w-full bg-surface-base border border-white/5 rounded-xl px-4 py-3 text-content-primary focus:ring-2 focus:ring-action-primary outline-none transition-all placeholder:text-content-muted">
        </div>
 
        <div class="space-y-1">
          <label for="tipo-select" class="text-[10px] font-black uppercase tracking-widest text-action-primary ml-1">Tipo</label>
          <select id="tipo-select" [(ngModel)]="filtros.tipo" (change)="onFiltrosChange()"
            class="w-full bg-surface-base border border-white/5 rounded-xl px-4 py-3 text-content-primary focus:ring-2 focus:ring-action-primary outline-none transition-all cursor-pointer">
            <option value="" class="bg-surface-card">Cualquier tipo</option>
            @for (t of tipos; track t) {
              <option [value]="t" class="bg-surface-card">{{ t | formatEnum }}</option>
            }
          </select>
        </div>
 
        <div class="space-y-1">
          <label for="combustible-select" class="text-[10px] font-black uppercase tracking-widest text-action-primary ml-1">Combustible</label>
          <select id="combustible-select" [(ngModel)]="filtros.combustible" (change)="onFiltrosChange()"
            class="w-full bg-surface-base border border-white/5 rounded-xl px-4 py-3 text-content-primary focus:ring-2 focus:ring-action-primary outline-none transition-all cursor-pointer">
            <option value="" class="bg-surface-card">Cualquier combustible</option>
            @for (c of combustibles; track c) {
              <option [value]="c" class="bg-surface-card">{{ c | formatEnum }}</option>
            }
          </select>
        </div>
 
        <div class="space-y-1">
          <label for="precio-input" class="text-[10px] font-black uppercase tracking-widest text-action-primary ml-1">Precio Máx (€)</label>
          <input id="precio-input" type="number" [(ngModel)]="filtros.maxPrecio" (input)="onFiltrosChange()"
            placeholder="Ej: 30000" min="0"
            class="w-full bg-surface-base border border-white/5 rounded-xl px-4 py-3 text-content-primary focus:ring-2 focus:ring-action-primary outline-none transition-all placeholder:text-content-muted">
        </div>
 
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label for="anio-input" class="text-[10px] font-black uppercase tracking-widest text-action-primary ml-1">Año Mín</label>
            <input id="anio-input" type="number" [(ngModel)]="filtros.anioFabricacion" (input)="onFiltrosChange()"
              placeholder="2020" min="1900"
              class="w-full bg-surface-base border border-white/5 rounded-xl px-4 py-3 text-content-primary focus:ring-2 focus:ring-action-primary outline-none transition-all placeholder:text-content-muted text-sm">
          </div>
          <div class="space-y-1">
            <label for="km-input" class="text-[10px] font-black uppercase tracking-widest text-action-primary ml-1">Km Máx</label>
            <input id="km-input" type="number" [(ngModel)]="filtros.maxKm" (input)="onFiltrosChange()"
              placeholder="150k" min="0"
              class="w-full bg-surface-base border border-white/5 rounded-xl px-4 py-3 text-content-primary focus:ring-2 focus:ring-action-primary outline-none transition-all placeholder:text-content-muted text-sm">
          </div>
        </div>
 
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label for="potencia-input" class="text-[10px] font-black uppercase tracking-widest text-action-primary ml-1">Potencia Mín</label>
            <input id="potencia-input" type="number" [(ngModel)]="filtros.minPotencia" (input)="onFiltrosChange()"
              placeholder="120 CV" min="0"
              class="w-full bg-surface-base border border-white/5 rounded-xl px-4 py-3 text-content-primary focus:ring-2 focus:ring-action-primary outline-none transition-all placeholder:text-content-muted text-sm">
          </div>
          <div class="space-y-1">
            <label for="ciudad-input" class="text-[10px] font-black uppercase tracking-widest text-action-primary ml-1">Ciudad</label>
            <input id="ciudad-input" type="text" [(ngModel)]="filtros.ciudad" (input)="onFiltrosChange()"
              placeholder="Ej: Madrid"
              class="w-full bg-surface-base border border-white/5 rounded-xl px-4 py-3 text-content-primary focus:ring-2 focus:ring-action-primary outline-none transition-all placeholder:text-content-muted text-sm">
          </div>
        </div>

        <div class="space-y-1">
          <label for="etiqueta-select" class="text-[10px] font-black uppercase tracking-widest text-action-primary ml-1">Distintivo Ambiental</label>
          <select id="etiqueta-select" [(ngModel)]="filtros.etiqueta" (change)="onFiltrosChange()"
            class="w-full bg-surface-base border border-white/5 rounded-xl px-4 py-3 text-content-primary focus:ring-2 focus:ring-action-primary outline-none transition-all cursor-pointer">
            <option value="" class="bg-surface-card">Cualquier distintivo</option>
            @for (e of etiquetas; track e) {
              <option [value]="e" class="bg-surface-card">{{ e | formatEnum }}</option>
            }
          </select>
        </div>

        <!-- Solo Verificados toggle -->
        <div class="pt-2">
          <button
            id="verificado-toggle"
            type="button"
            (click)="toggleVerificado()"
            [class]="filtros.verificado
              ? 'w-full flex items-center justify-between gap-3 px-4 py-3 bg-action-primary/10 border border-action-primary rounded-xl transition-all'
              : 'w-full flex items-center justify-between gap-3 px-4 py-3 bg-surface-base border border-white/5 rounded-xl transition-all hover:border-action-primary/40'"
          >
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                [class]="filtros.verificado ? 'text-action-primary' : 'text-content-muted'">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
              <span [class]="filtros.verificado ? 'text-xs font-black text-action-primary uppercase tracking-widest' : 'text-xs font-bold text-content-secondary uppercase tracking-widest'">Solo Verificados</span>
            </div>
            <!-- Pill toggle -->
            <div [class]="filtros.verificado
              ? 'w-10 h-5 bg-action-primary rounded-full relative transition-all'
              : 'w-10 h-5 bg-white/10 rounded-full relative transition-all'">
              <div [class]="filtros.verificado
                ? 'absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-md'
                : 'absolute left-0.5 top-0.5 w-4 h-4 bg-white/40 rounded-full transition-all shadow-md'">
              </div>
            </div>
          </button>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    .animate-slide-in { animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
    
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(29, 154, 226, 0.2); border-radius: 10px; }
  `]
})
export class VehicleCatalogComponent implements OnInit, OnDestroy {
  private vehicleService = inject(VehicleService);
  private router = inject(Router);
  private ns = inject(NotificationService);
  private chatService = inject(ChatService);

  private subs = new Subscription();

  vehiculos = signal<Vehicle[]>([]);
  marcas = signal<Marca[]>([]);
  loading = signal(true);
  tipos = Object.values(TipoVehiculo);
  combustibles = Object.values(CombustibleVehiculo);
  etiquetas = Object.values(EtiquetaMedioambiental);

  // ESTADO DE PAGINACIÓN
  totalItems = signal(0);
  currentPage = signal(0); // Base 0 para Spring
  itemsPerPage = 12;

  filtros = {
    marca: '',
    modelo: '',
    tipo: '',
    combustible: '',
    maxPrecio: null as number | null,
    maxKm: null as number | null,
    minPotencia: null as number | null,
    plazas: null as number | null,
    disponible: true,
    verificado: null as EstadoVerificacion | null,
    anioFabricacion: null as number | null,
    ciudad: '',
    etiqueta: '' as any
  };

  showMobileFilters = signal(false);

  ngOnInit() {
    this.cargarMarcas();
    this.fetchVehiculos();
    this.listenToRealTimeUpdates();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private listenToRealTimeUpdates() {
    this.subs.add(
      this.chatService.vehiculosUpdates$.subscribe(note => {
        if (note) {
          // Si alguien publica o borra, refrescamos el catálogo
          this.fetchVehiculos();
          if (note.type === 'VEHICLE_CREATED') {
             this.ns.info('¡Un nuevo vehículo acaba de entrar en el catálogo!');
          }
        }
      })
    );
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

  fetchVehiculos() {
    this.loading.set(true);
    
    // Usamos buscarVehiculos siempre para mantener consistencia.
    // El backend se encargará de los nulos si no hay filtros aplicados.
    this.vehicleService.buscarVehiculos(this.filtros, this.currentPage(), this.itemsPerPage).subscribe({
      next: (response) => {
        this.vehiculos.set(response.content || []);
        
        // Detección robusta del total de elementos
        const total = response.page?.totalElements ?? response.totalElements ?? response.content?.length ?? 0;
        this.totalItems.set(total);
        
        this.loading.set(false);
      },
      error: (err: any) => {
        this.vehiculos.set([]);
        this.totalItems.set(0);
        this.loading.set(false);
        
        // Si hay filtros activos y no es un 404 común (sin resultados), mostramos error
        if (this.tieneFiltrosActivos && err.status !== 404) {
          const errorMsg = err?.error?.message || 'Error al buscar vehículos';
          this.ns.error(errorMsg);
        }
      }
    });
  }

  get tieneFiltrosActivos(): boolean {
    return Object.entries(this.filtros).some(([key, val]) => {
      if (key === 'disponible') return false;
      return val !== null && val !== '' && val !== undefined;
    });
  }

  toggleVerificado() {
    this.filtros.verificado = this.filtros.verificado ? null : EstadoVerificacion.VERIFICADO;
    this.currentPage.set(0);
    this.fetchVehiculos();
  }

  onFiltrosChange() {
    // Solo buscamos automáticamente si no estamos en formato móvil (drawer abierto)
    // Opcionalmente, podemos detectar el ancho de pantalla, pero aquí usaremos el estado del drawer.
    if (!this.showMobileFilters()) {
      this.currentPage.set(0);
      this.fetchVehiculos();
    }
  }

  aplicarFiltros() {
    this.showMobileFilters.set(false);
    document.body.style.overflow = 'auto';
    this.currentPage.set(0);
    this.fetchVehiculos();
  }

  toggleMobileFilters() {
    this.showMobileFilters.update(v => !v);
    if (this.showMobileFilters()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  resetFiltros() {
    this.filtros = {
      marca: '',
      modelo: '',
      tipo: '',
      combustible: '',
      maxPrecio: null,
      maxKm: null,
      minPotencia: null,
      plazas: null,
      disponible: true,
      verificado: null,
      anioFabricacion: null,
      ciudad: '',
      etiqueta: '' as any
    };
    this.currentPage.set(0);
    this.showMobileFilters.set(false);
    document.body.style.overflow = 'auto';
    this.fetchVehiculos();
  }

  getEtiquetaInfo(e?: EtiquetaMedioambiental) {
    switch (e) {
      case EtiquetaMedioambiental.CERO: 
        return { color: 'bg-[#0079C1]', text: 'CERO', textColor: 'text-white' };
      case EtiquetaMedioambiental.ECO: 
        return { color: 'bg-gradient-to-r from-[#8DB92E] to-[#0079C1]', text: 'ECO', textColor: 'text-white' };
      case EtiquetaMedioambiental.C: 
        return { color: 'bg-[#8DB92E]', text: 'C', textColor: 'text-white' };
      case EtiquetaMedioambiental.B: 
        return { color: 'bg-[#FFD700]', text: 'B', textColor: 'text-black' };
      default: 
        return { color: 'bg-content-muted/20', text: 'SIN ET.', textColor: 'text-content-muted' };
    }
  }

  verDetalles(v: Vehicle) {
    this.router.navigate(['/vehiculo', v.idVehiculo], { state: { vehicle: v } });
  }

  onPageChange(page: number) {
    this.currentPage.set(page - 1);
    this.fetchVehiculos();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
