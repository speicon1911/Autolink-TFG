import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentaService } from '../../../core/services/venta.service';
import { Sale } from '../../../core/models/sale.model';

@Component({
    selector: 'app-admin-audit',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-6 animate-fade-in">
      <header>
        <h1 class="text-3xl font-black text-white">Auditoría de Ventas</h1>
        <p class="text-slate-400">Registro histórico de todas las transacciones de la plataforma</p>
      </header>
    
      @if (loading()) {
        <div class="flex justify-center py-20">
          <div class="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      }
    
      @if (!loading()) {
        <div class="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-slate-800/50 border-b border-slate-700">
                <tr>
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">ID Venta</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Fecha</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Cliente</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Estado</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 font-right">Monto</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800">
                @for (s of sales(); track s) {
                  <tr class="hover:bg-slate-800/30 transition-colors">
                    <td class="px-6 py-4 text-white font-bold">#{{ s.idVenta }}</td>
                    <td class="px-6 py-4 text-slate-400 text-sm">{{ s.fecha | date:'shortDate' }}</td>
                    <td class="px-6 py-4">
                      <p class="text-white text-sm font-medium">{{ s.cliente.nombre }} {{ s.cliente.apellidos }}</p>
                      <p class="text-slate-500 text-[10px]">{{ s.cliente.correo }}</p>
                    </td>
                    <td class="px-6 py-4">
                   <span [ngClass]="{
                     'text-emerald-500 bg-emerald-500/10 border-emerald-500/20': s.estadoVenta === 'COMPLETADA',
                     'text-amber-500 bg-amber-500/10 border-amber-500/20': s.estadoVenta === 'PENDIENTE',
                     'text-rose-500 bg-rose-500/10 border-rose-500/20': s.estadoVenta === 'CANCELADA'
                   }" class="px-2 py-0.5 rounded-full text-[10px] font-black border uppercase">
                        {{ s.estadoVenta }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <span class="text-lg font-black text-white">{{ s.precio | currency:'EUR' }}</span>
                    </td>
                  </tr>
                }
              </tbody>
              <tfoot class="bg-slate-800/20 border-t border-slate-800">
                <tr>
                  <td colspan="4" class="px-6 py-4 text-right text-slate-500 font-bold uppercase tracking-wider">Volumen Total</td>
                  <td class="px-6 py-4 text-right text-xl font-black text-blue-500">{{ totalVolume() | currency:'EUR' }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
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

    totalVolume() {
        return this.sales().reduce((acc, current) => acc + current.precio, 0);
    }
}
