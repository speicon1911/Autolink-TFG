import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentaService } from '../../../core/services/venta.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Sale } from '../../../core/models/sale.model';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { ChatService } from '../../../core/services/chat.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
    selector: 'app-client-purchases',
    standalone: true,
    imports: [CommonModule, FormsModule, ConfirmModalComponent, PaginationComponent],
    template: `
    <div class="space-y-6 animate-fade-in">
      <header>
        <h1 class="text-3xl font-black text-content-primary">Mis Compras</h1>
        <p class="text-content-secondary">Historial de vehículos adquiridos</p>
      </header>
    
      @if (loading()) {
        <div class="flex justify-center py-20">
          <div class="w-12 h-12 border-4 border-action-primary/20 border-t-action-primary rounded-full animate-spin"></div>
        </div>
      }
    
      @if (!loading() && purchases().length > 0) {
        <!-- Status Filter -->
        <div class="flex flex-wrap items-center gap-2 mb-4">
          <button (click)="setStatus('TODAS')" 
            [class]="selectedStatus() === 'TODAS' ? 'px-4 py-1.5 bg-action-primary text-surface-base rounded-xl font-black text-xs transition-all' : 'px-4 py-1.5 bg-surface-card text-content-secondary hover:text-action-primary rounded-xl font-bold text-xs transition-all border border-white/5'">TODAS</button>
          <button (click)="setStatus('REALIZADA')" 
            [class]="selectedStatus() === 'REALIZADA' ? 'px-4 py-1.5 bg-emerald-500 text-surface-base rounded-xl font-black text-xs transition-all' : 'px-4 py-1.5 bg-surface-card text-content-secondary hover:text-emerald-500 rounded-xl font-bold text-xs transition-all border border-white/5'">COMPRADAS</button>
          <button (click)="setStatus('EN_PROGRESO')" 
            [class]="selectedStatus() === 'EN_PROGRESO' ? 'px-4 py-1.5 bg-amber-500 text-surface-base rounded-xl font-black text-xs transition-all' : 'px-4 py-1.5 bg-surface-card text-content-secondary hover:text-amber-500 rounded-xl font-bold text-xs transition-all border border-white/5'">PENDIENTES</button>
          <button (click)="setStatus('ANULADA')" 
            [class]="selectedStatus() === 'ANULADA' ? 'px-4 py-1.5 bg-rose-500 text-surface-base rounded-xl font-black text-xs transition-all' : 'px-4 py-1.5 bg-surface-card text-content-secondary hover:text-rose-500 rounded-xl font-bold text-xs transition-all border border-white/5'">ANULADAS</button>
        </div>
      }

      @if (!loading() && purchases().length === 0) {
        <div class="text-center py-20 bg-surface-card backdrop-blur-sm rounded-3xl border border-dashed border-white/10">
          <div class="w-16 h-16 bg-surface-base rounded-2xl flex items-center justify-center mx-auto text-action-primary mb-4 border border-white/5">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </div>
          <p class="text-content-muted text-lg">Aún no has realizado ninguna compra.</p>
        </div>
      }
    
      @if (!loading() && pagedPurchases().length > 0) {
        <div class="grid gap-4">
          @for (p of pagedPurchases(); track p.idVenta) {
            <div
              class="bg-surface-card backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-action-primary/50 transition-all shadow-xl group">
              <div class="flex items-center gap-5">
                <div class="w-14 h-14 bg-surface-base rounded-xl flex items-center justify-center text-action-primary border border-white/5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                </div>
                <div class="space-y-1">
                  <h3 class="text-content-primary font-bold text-lg flex items-center gap-2">
                    {{ p.vehiculo.marca?.nombre }} {{ p.vehiculo.modelo }}
                    @if (p.vehiculo.verificado === 'VERIFICADO') {
                      <svg class="text-action-primary" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 11 11 13 15 9"/></svg>
                    }
                  </h3>
                  <p class="text-content-secondary text-sm italic">{{ p.fecha | date:'longDate':'':'es' }}</p>
                </div>
              </div>
              <div class="flex flex-col md:items-end gap-1">
                <span class="text-content-muted text-[10px] font-bold uppercase tracking-wider">Monto Total</span>
                @if (editingId() === p.idVenta) {
                  <div class="flex items-center gap-2 mt-1">
                    <input type="number" [(ngModel)]="newPrice" class="w-24 bg-surface-base border border-action-primary rounded p-1 text-content-primary text-right outline-none">
                    <button (click)="savePrice(p)" [disabled]="isProcessing()" class="text-emerald-500 hover:text-emerald-400 tooltip disabled:opacity-50" title="Guardar Precio">
                      @if (isProcessing()) {
                        <div class="w-5 h-5 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                      } @else {
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      }
                    </button>
                    <button (click)="editingId.set(null)" [disabled]="isProcessing()" class="text-rose-500 hover:text-rose-400 tooltip disabled:opacity-50" title="Cancelar Edición">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                } @else {
                  <span class="text-2xl font-black text-action-primary">{{ p.precio | currency:'EUR' }}</span>
                }
              </div>
              <div class="flex items-center gap-3">
                @if (p.estadoVenta === 'EN_PROGRESO') {
                  @if (p.rolUltimoModificador !== 'CLIENTE') {
                    <button (click)="completeSale(p)" class="p-2 hover:bg-emerald-500/10 rounded-lg text-emerald-600 hover:text-emerald-500 transition-all tooltip" title="Aceptar y Formalizar Compra">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    </button>
                    <button (click)="startEdit(p)" class="p-2 hover:bg-action-primary/10 rounded-lg text-content-muted hover:text-action-primary transition-all tooltip" title="Editar Oferta (Negociar)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                    </button>
                    <button (click)="cancelSale(p)" class="p-2 hover:bg-rose-500/10 rounded-lg text-rose-600 hover:text-rose-500 transition-all tooltip" title="Anular Petición">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  } @else {
                    <span class="text-amber-500 text-xs italic mr-2 whitespace-nowrap">Esperando respuesta...</span>
                    <!-- El cliente solo puede retractarse si ya hizo una oferta y espera -->
                    <button (click)="cancelSale(p)" class="p-2 hover:bg-rose-500/10 rounded-lg text-rose-600 hover:text-rose-500 transition-all tooltip" title="Anular Petición">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  }
                  <button (click)="iniciarChat(p)" class="p-2 hover:bg-action-primary/10 rounded-lg text-action-primary transition-all tooltip" title="Chat con Vendedor">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </button>
                } @else {
                  <span [ngClass]="{
                    'bg-emerald-500/10 text-emerald-600 border-emerald-500/20': p.estadoVenta === 'REALIZADA',
                    'bg-rose-500/10 text-rose-600 border-rose-500/20': p.estadoVenta === 'ANULADA'
                  }" class="px-3 py-1 rounded-full text-[10px] font-bold border uppercase">
                    {{ p.estadoVenta }}
                  </span>
                }
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
  `]
})
export class ClientPurchasesComponent implements OnInit, OnDestroy {
    private ventaService = inject(VentaService);
    private authService = inject(AuthService);
    private ns = inject(NotificationService);
    private chatService = inject(ChatService);

    private subs = new Subscription();

    purchases = signal<Sale[]>([]);
    loading = signal(true);
    isProcessing = signal(false);
    editingId = signal<number | null>(null);
    newPrice: number = 0;

    // Pagination + Filters
    currentPage = signal(0);
    itemsPerPage = 10;
    selectedStatus = signal<string>('TODAS');

    filteredPurchases = computed(() => {
        const status = this.selectedStatus();
        const all = this.purchases();
        return status === 'TODAS' ? all : all.filter(p => p.estadoVenta === status);
    });

    totalFilteredItems = computed(() => this.filteredPurchases().length);

    pagedPurchases = computed(() => {
        const start = this.currentPage() * this.itemsPerPage;
        return this.filteredPurchases().slice(start, start + this.itemsPerPage);
    });

    // MODAL DE CONFIRMACIÓN
    modalConfig = signal<{
        isOpen: boolean;
        title: string;
        message: string;
        action: 'completePurchase' | 'cancelPurchase' | null;
        data: any;
    }>({
        isOpen: false,
        title: '',
        message: '',
        action: null,
        data: null
    });

    ngOnInit() {
        this.loadPurchases();
        this.listenToRealTimeUpdates();
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    private listenToRealTimeUpdates() {
        this.subs.add(
            this.chatService.ofertasUpdates$.subscribe(note => {
                if (note) {
                    this.ns.info(note.message);
                    this.loadPurchases();
                }
            })
        );
    }

    loadPurchases() {
        const user = this.authService.currentUser$();
        if (user) {
            this.loading.set(true);
            this.ventaService.getPurchasesByCliente(user.id).subscribe({
                next: (data) => {
                    const sorted = data.sort((a, b) => b.idVenta - a.idVenta);
                    this.purchases.set(sorted);
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
        this.ventaService.updatePrecioVenta(sale.idVenta, this.newPrice, 'CLIENTE').subscribe({
            next: () => {
                this.ns.success('Oferta enviada correctamente');
                this.isProcessing.set(false);
                this.editingId.set(null);
                this.loadPurchases();
            },
            error: () => {
                this.ns.error('Error al enviar la oferta');
                this.isProcessing.set(false);
            }
        });
    }

    completeSale(sale: Sale) {
        this.modalConfig.set({
            isOpen: true,
            title: 'Confirmar Compra',
            message: `¿Confirmas que aceptas la compra por ${sale.precio}€? La operación se formalizará inmediatamente y el vehículo será tuyo.`,
            action: 'completePurchase',
            data: sale
        });
    }

    cancelSale(sale: Sale) {
        this.modalConfig.set({
            isOpen: true,
            title: 'Anular Petición',
            message: '¿Estás seguro de que deseas ANULAR esta petición de compra? La operación no se podrá revertir.',
            action: 'cancelPurchase',
            data: sale
        });
    }

    handleModalConfirm() {
        const config = this.modalConfig();
        if (!config.action) return;

        if (config.action === 'completePurchase') {
            const sale = config.data as Sale;
            this.isProcessing.set(true);
            this.ventaService.completarVenta(sale.idVenta).subscribe({
                next: () => {
                    this.ns.success('¡Felicidades! Compra completada con éxito');
                    this.isProcessing.set(false);
                    this.loadPurchases();
                    this.closeConfirmModal();
                },
                error: () => {
                    this.ns.error('Error al completar la compra');
                    this.isProcessing.set(false);
                    this.closeConfirmModal();
                }
            });
        } else if (config.action === 'cancelPurchase') {
            const sale = config.data as Sale;
            this.isProcessing.set(true);
            this.ventaService.anularVenta(sale.idVenta).subscribe({
                next: () => {
                    this.ns.success('Petición anulada correctamente');
                    this.isProcessing.set(false);
                    this.loadPurchases();
                    this.closeConfirmModal();
                },
                error: () => {
                    this.ns.error('Error al anular la petición');
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

    iniciarChat(sale: Sale) {
        if (sale.vendedor) {
            this.chatService.abrirChatCon(sale.vendedor);
        }
    }
}
