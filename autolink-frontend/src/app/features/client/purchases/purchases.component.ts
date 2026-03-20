import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentaService } from '../../../core/services/venta.service';
import { AuthService } from '../../../core/services/auth.service';
import { Sale } from '../../../core/models/sale.model';

@Component({
    selector: 'app-client-purchases',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-6 animate-fade-in">
      <header>
        <h1 class="text-3xl font-black text-pitch-black-50">Mis Compras</h1>
        <p class="text-baltic-blue-400">Historial de vehículos adquiridos</p>
      </header>
    
      @if (loading()) {
        <div class="flex justify-center py-20">
          <div class="w-12 h-12 border-4 border-baltic-blue-500/20 border-t-baltic-blue-500 rounded-full animate-spin"></div>
        </div>
      }
    
      @if (!loading() && purchases().length === 0) {
        <div class="text-center py-20 bg-white/5 backdrop-blur-sm rounded-3xl border border-dashed border-dark-teal-800">
          <div class="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-baltic-blue-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </div>
          <p class="text-baltic-blue-300/60 text-lg">Aún no has realizado ninguna compra.</p>
        </div>
      }
    
      @if (!loading() && purchases().length > 0) {
        <div class="grid gap-4">
          @for (p of purchases(); track p) {
            <div
              class="bg-white/5 backdrop-blur-md border-[3px] border-pitch-black-950 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-baltic-blue-500 transition-colors shadow-xl">
              <div class="flex items-center gap-5">
                <div class="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-baltic-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                </div>
                <div class="space-y-1">
                  <h3 class="text-pitch-black-50 font-bold text-lg">
                    {{ p.vehiculo.marca?.nombre }} {{ p.vehiculo.modelo }}
                  </h3>
                  <p class="text-baltic-blue-400 text-sm italic">{{ p.fecha | date:'longDate':'':'es' }}</p>
                </div>
              </div>
              <div class="flex flex-col md:items-end gap-1">
                <span class="text-baltic-blue-400 text-[10px] font-bold uppercase tracking-wider">Monto Total</span>
                <span class="text-2xl font-black text-baltic-blue-500">{{ p.precio | currency:'EUR' }}</span>
              </div>
              <div class="flex items-center gap-3">
              <span [ngClass]="{
                'bg-emerald-500/10 text-emerald-600 border-emerald-500/20': p.estadoVenta === 'COMPLETADA',
                'bg-amber-500/10 text-amber-600 border-amber-500/20': p.estadoVenta === 'PENDIENTE',
                'bg-rose-500/10 text-rose-600 border-rose-500/20': p.estadoVenta === 'CANCELADA'
              }" class="px-3 py-1 rounded-full text-[10px] font-bold border uppercase">
                  {{ p.estadoVenta }}
                </span>
                <button class="p-2 hover:bg-white/60 rounded-lg text-dark-teal-400 hover:text-baltic-blue-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
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
export class ClientPurchasesComponent implements OnInit {
    private ventaService = inject(VentaService);
    private authService = inject(AuthService);

    purchases = signal<Sale[]>([]);
    loading = signal(true);

    ngOnInit() {
        const user = this.authService.currentUser$();
        if (user) {
            this.ventaService.getPurchasesByCliente(user.id).subscribe({
                next: (data) => {
                    this.purchases.set(data);
                    this.loading.set(false);
                },
                error: () => this.loading.set(false)
            });
        }
    }
}
