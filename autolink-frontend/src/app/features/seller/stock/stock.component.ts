import { Component, OnInit, inject, signal } from '@angular/core';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../../core/services/vehicle.service';
import { VentaService } from '../../../core/services/venta.service';
import { AuthService } from '../../../core/services/auth.service';
import { Vehicle } from '../../../core/models/vehicle.model';
import { Sale } from '../../../core/models/sale.model';
import { NotificationService } from '../../../core/services/notification.service';
import { VehicleFormComponent } from './vehicle-form.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-seller-stock',
  standalone: true,
  imports: [CommonModule, VehicleFormComponent, PaginationComponent, FormsModule, ConfirmModalComponent],
  template: `
    <div class="space-y-6 animate-fade-in">
      <header class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-black text-pitch-black-50">Mi Stock</h1>
          <p class="text-baltic-blue-400">Gestiona tus vehículos publicados</p>
        </div>
        <button (click)="onOpenForm()"
          class="btn-primary text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-baltic-blue-600/20 transition-all active:scale-95 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Publicar Vehículo
        </button>
      </header>
    
      <!-- Sales Modal -->
      @if (showSalesModal()) {
        <div class="fixed inset-0 bg-pitch-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in">
          <div class="bg-dark-teal-950 border border-white/10 rounded-3xl w-full max-w-4xl shadow-2xl relative overflow-hidden">
            <header class="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div>
                <h2 class="text-2xl font-black text-pitch-black-50">Solicitudes para {{ selectedVehicle()?.modelo }}</h2>
                <p class="text-baltic-blue-400 text-sm">Gestiona las ofertas recibidas para este vehículo</p>
              </div>
              <button (click)="onCloseSalesModal()" class="p-2 hover:bg-white/5 rounded-full text-baltic-blue-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </header>

            <div class="p-6 max-h-[60vh] overflow-y-auto">
              @if (vehicleSales().length === 0) {
                <div class="text-center py-10 text-baltic-blue-300/60">
                  No hay solicitudes para este vehículo todavía.
                </div>
              } @else {
                <div class="overflow-x-auto">
                  <table class="w-full text-left">
                    <thead>
                      <tr class="text-[10px] uppercase tracking-widest text-baltic-blue-400 border-b border-white/5">
                        <th class="pb-4 font-bold">Cliente</th>
                        <th class="pb-4 font-bold">Fecha</th>
                        <th class="pb-4 font-bold">Estado</th>
                        <th class="pb-4 font-bold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/5">
                      @for (s of vehicleSales(); track s.idVenta) {
                        <tr class="group hover:bg-white/5 transition-colors">
                          <td class="py-4">
                            <span class="text-pitch-black-50 font-bold block">{{ s.cliente.nombre }} {{ s.cliente.apellidos }}</span>
                            <span class="text-xs text-baltic-blue-400">{{ s.cliente.correo }}</span>
                          </td>
                          <td class="py-4 text-sm text-pitch-black-50">{{ s.fecha }}</td>
                          <td class="py-4">
                            <div class="flex flex-col gap-1">
                              @if (editingPriceId() === s.idVenta) {
                                <div class="flex items-center gap-2">
                                  <input type="number" [(ngModel)]="tempPrice" class="w-20 bg-pitch-black/20 border border-baltic-blue-500 rounded p-1 text-white text-xs outline-none">
                                  <button (click)="savePrice(s)" [disabled]="isProcessing()" class="text-emerald-500 hover:text-emerald-400 disabled:opacity-50">
                                    @if (isProcessing()) {
                                      <div class="w-4 h-4 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                                    } @else {
                                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                    }
                                  </button>
                                  <button (click)="editingPriceId.set(null)" [disabled]="isProcessing()" class="text-rose-500 hover:text-rose-400 disabled:opacity-50">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                  </button>
                                </div>
                              } @else {
                                <span class="text-baltic-blue-500 font-bold flex items-center gap-1"
                                  [ngClass]="{'cursor-pointer hover:text-baltic-blue-400': s.estadoVenta === 'EN_PROGRESO' && s.rolUltimoModificador !== 'VENDEDOR'}"
                                  (click)="s.estadoVenta === 'EN_PROGRESO' && s.rolUltimoModificador !== 'VENDEDOR' && startEditPrice(s)">
                                  {{ s.precio | currency:'EUR':'symbol':'1.0-0' }}
                                  @if (s.estadoVenta === 'EN_PROGRESO' && s.rolUltimoModificador !== 'VENDEDOR') {
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                                  }
                                </span>
                              }
                              <span class="px-2 py-0.5 w-fit rounded-md text-[8px] font-black uppercase tracking-tighter"
                                [ngClass]="{
                                  'bg-baltic-blue-500/20 text-baltic-blue-400': s.estadoVenta === 'EN_PROGRESO',
                                  'bg-emerald-500/20 text-emerald-500': s.estadoVenta === 'REALIZADA',
                                  'bg-rose-500/20 text-rose-500': s.estadoVenta === 'ANULADA'
                                }">
                                {{ s.estadoVenta }}
                              </span>
                            </div>
                          </td>
                          <td class="py-4">
                            @if (s.estadoVenta === 'EN_PROGRESO') {
                              @if (s.rolUltimoModificador !== 'VENDEDOR') {
                                <div class="flex items-center gap-2">
                                  <button (click)="onCompleteSale(s)" class="px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-[10px] font-bold transition-all">
                                    Aceptar
                                  </button>
                                  <button (click)="onAnularSale(s)" class="px-2 py-1 bg-white/10 hover:bg-rose-500/20 hover:text-rose-500 text-baltic-blue-400 rounded text-[10px] font-bold transition-all border border-white/5">
                                    Anular
                                  </button>
                                </div>
                              } @else {
                                <div class="flex items-center gap-2">
                                  <span class="text-amber-500 text-[10px] font-bold px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20">Esperando</span>
                                  <button (click)="onAnularSale(s)" class="px-2 py-1 bg-white/10 hover:bg-rose-500/20 hover:text-rose-500 text-baltic-blue-400 rounded text-[10px] font-bold transition-all border border-white/5">
                                    Anular
                                  </button>
                                </div>
                              }
                            }
                          </td>
                        </tr>
                        @if (s.precio) {
                          <tr class="text-[10px] text-baltic-blue-400 bg-white/5">
                            <td colspan="4" class="px-4 py-1 italic">Oferta: {{ s.precio | currency:'EUR' }}</td>
                          </tr>
                        }
                      }
                    </tbody>
                  </table>
                </div>
              }
            </div>
          </div>
        </div>
      }
    
      <!-- Vehicle Form Modal -->
      @if (showForm()) {
        <app-vehicle-form
          [editMode]="!!editingVehicle()"
          [vehicleToEdit]="editingVehicle()"
          (close)="onCloseForm()"
          (saved)="onVehicleSaved()">
        </app-vehicle-form>
      }
    
    
      @if (loading()) {
        <div class="flex justify-center py-20">
          <div class="w-12 h-12 border-4 border-baltic-blue-500/20 border-t-baltic-blue-500 rounded-full animate-spin"></div>
        </div>
      }
    
      @if (!loading() && vehicles().length === 0) {
        <div class="text-center py-20 bg-white/5 backdrop-blur-sm rounded-3xl border border-dashed border-dark-teal-800">
          <p class="text-baltic-blue-300/60">No tienes vehículos publicados actualmente.</p>
        </div>
      }
    
      @if (!loading() && vehicles().length > 0) {
        <div class="grid gap-4">
          @for (v of vehicles(); track v.idVehiculo) {
            <div
              class="bg-white/5 backdrop-blur-md border-[3px] border-pitch-black-950 rounded-2xl p-5 flex items-center justify-between gap-6 hover:border-baltic-blue-500 transition-all shadow-xl">
              <div class="flex items-center gap-4">
                <div class="w-16 h-12 bg-white/60 rounded-lg flex items-center justify-center text-dark-teal-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                </div>
                <div>
                  <h3 class="text-pitch-black-50 font-bold">{{ v.modelo }}</h3>
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold px-2 py-0.5 rounded-full"
                      [ngClass]="v.disponible ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-white/10 text-baltic-blue-400/60 border border-white/5'">
                      {{ v.disponible ? 'Disponible' : 'Vendido' }}
                    </span>
                    @if (v.verificado) {
                      <span class="text-[10px] text-baltic-blue-500 font-black uppercase tracking-widest">Verificado</span>
                    }
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-8">
                <div class="text-right">
                  <p class="text-[10px] text-baltic-blue-400 font-bold uppercase tracking-widest">Precio</p>
                  <p class="text-xl font-black text-pitch-black-50">{{ v.precio | currency:'EUR' }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <button (click)="onViewSales(v)" class="p-2 hover:bg-baltic-blue-500/10 rounded-lg text-baltic-blue-400 transition-colors flex items-center gap-1 text-xs font-bold" title="Ver Ofertas">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    Ofertas
                  </button>
                  <button (click)="onEdit(v)" class="p-2 hover:bg-white/60 rounded-lg text-dark-teal-400 hover:text-baltic-blue-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                  </button>
                  <button (click)="onDelete(v.idVehiculo)" class="p-2 hover:bg-rose-50 rounded-lg text-dark-teal-400 hover:text-rose-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </div>
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
export class SellerStockComponent implements OnInit {
  private vehicleService = inject(VehicleService);
  private ventaService = inject(VentaService);
  private authService = inject(AuthService);
  private ns = inject(NotificationService);

  vehicles = signal<Vehicle[]>([]);
  loading = signal(true);
  isProcessing = signal(false);
  showForm = signal(false);
  editingVehicle = signal<Vehicle | null>(null);

  // GESTIÓN DE OFERTAS
  showSalesModal = signal(false);
  selectedVehicle = signal<Vehicle | null>(null);
  vehicleSales = signal<Sale[]>([]);
  editingPriceId = signal<number | null>(null);
  tempPrice: number = 0;

  // PAGINACIÓN
  totalItems = signal(0);
  currentPage = signal(0);
  itemsPerPage = 10;

  // MODAL DE CONFIRMACIÓN
  modalConfig = signal<{
    isOpen: boolean;
    title: string;
    message: string;
    action: 'deleteVehicle' | 'completeSale' | 'anularSale' | null;
    data: any;
  }>({
    isOpen: false,
    title: '',
    message: '',
    action: null,
    data: null
  });

  ngOnInit() {
    this.cargarStock();
  }

  onOpenForm() {
    this.editingVehicle.set(null);
    this.showForm.set(true);
  }

  onCloseForm() {
    this.showForm.set(false);
    this.editingVehicle.set(null);
  }

  onVehicleSaved() {
    this.showForm.set(false);
    this.editingVehicle.set(null);
    this.cargarStock();
  }

  cargarStock() {
    const user = this.authService.currentUser$();
    if (user) {
      this.loading.set(true);
      this.vehicleService.getVehiculosPorVendedor(user.id, this.currentPage(), this.itemsPerPage).subscribe({
        next: (response) => {
          this.vehicles.set(response.content || []);
          const total = response.page?.totalElements ?? response.totalElements ?? response.content?.length ?? 0;
          this.totalItems.set(total);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    }
  }

  onDelete(id: number) {
    this.modalConfig.set({
      isOpen: true,
      title: 'Eliminar Vehículo',
      message: '¿Estás seguro de que deseas eliminar este vehículo? Esta acción no se puede deshacer.',
      action: 'deleteVehicle',
      data: id
    });
  }

  onEdit(v: Vehicle) {
    this.editingVehicle.set(v);
    this.showForm.set(true);
  }


  onViewSales(v: Vehicle) {
    if (!v.idVehiculo) return;
    this.selectedVehicle.set(v);
    this.showSalesModal.set(true);
    this.loadVehicleSales(v.idVehiculo);
  }

  onCloseSalesModal() {
    this.showSalesModal.set(false);
    this.selectedVehicle.set(null);
    this.vehicleSales.set([]);
    this.editingPriceId.set(null);
  }

  loadVehicleSales(idVehiculo: number) {
    this.ventaService.getSalesByVehiculo(idVehiculo).subscribe({
      next: (sales) => {
        this.vehicleSales.set(sales);
        if (this.editingPriceId() && !sales.find(s => s.idVenta === this.editingPriceId())) {
          this.editingPriceId.set(null);
        }
      },
      error: (err) => {
        console.error('Error al cargar ventas del vehículo:', err);
        this.ns.error('Error al cargar las solicitudes');
      }
    });
  }

  startEditPrice(sale: Sale) {
    this.editingPriceId.set(sale.idVenta);
    this.tempPrice = sale.precio;
  }

  savePrice(sale: Sale) {
    if (this.tempPrice <= 0) {
      this.ns.error('El precio debe ser mayor a 0');
      return;
    }
    this.isProcessing.set(true);
    this.ventaService.updatePrecioVenta(sale.idVenta, this.tempPrice, 'VENDEDOR').subscribe({
      next: () => {
        this.ns.success('Contraoferta enviada con éxito');
        this.isProcessing.set(false);
        this.editingPriceId.set(null);
        if (this.selectedVehicle()?.idVehiculo) {
          this.loadVehicleSales(this.selectedVehicle()!.idVehiculo);
        }
      },
      error: () => this.isProcessing.set(false)
    });
  }

  onCompleteSale(sale: Sale) {
    this.modalConfig.set({
      isOpen: true,
      title: 'Confirmar Venta',
      message: '¿Confirmas la venta de este vehículo? Se marcará como no disponible.',
      action: 'completeSale',
      data: sale
    });
  }

  onAnularSale(sale: Sale) {
    this.modalConfig.set({
      isOpen: true,
      title: 'Anular Solicitud',
      message: '¿Estás seguro de anular esta solicitud? El vehículo seguirá disponible para otros clientes.',
      action: 'anularSale',
      data: sale
    });
  }

  handleModalConfirm() {
    const config = this.modalConfig();
    if (!config.action) return;

    if (config.action === 'deleteVehicle') {
      const id = config.data as number;
      this.vehicleService.deleteVehiculo(id).subscribe({
        next: () => {
          this.ns.success('Vehículo eliminado con éxito');
          this.cargarStock();
          this.closeConfirmModal();
        },
        error: () => {
          this.ns.error('Error al eliminar el vehículo');
          this.closeConfirmModal();
        }
      });
    } else if (config.action === 'completeSale') {
      const sale = config.data as Sale;
      this.isProcessing.set(true);
      this.ventaService.completarVenta(sale.idVenta).subscribe({
        next: () => {
          this.ns.success('¡Venta realizada con éxito!');
          this.isProcessing.set(false);
          this.onCloseSalesModal();
          this.cargarStock();
          this.closeConfirmModal();
        },
        error: () => {
          this.ns.error('Error al completar la venta');
          this.isProcessing.set(false);
          this.closeConfirmModal();
        }
      });
    } else if (config.action === 'anularSale') {
      const sale = config.data as Sale;
      this.isProcessing.set(true);
      this.ventaService.anularVenta(sale.idVenta).subscribe({
        next: () => {
          this.ns.success('Solicitud anulada');
          this.isProcessing.set(false);
          if (sale.vehiculo.idVehiculo) {
            this.loadVehicleSales(sale.vehiculo.idVehiculo);
          }
          this.closeConfirmModal();
        },
        error: () => {
          this.ns.error('Error al anular la solicitud');
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

  onPageChange(page: number) {
    this.currentPage.set(page - 1);
    this.cargarStock();
  }
}
