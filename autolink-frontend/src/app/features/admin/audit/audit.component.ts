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
        <h1 class="text-3xl font-black text-pitch-black-50">Auditoría de Ventas</h1>
        <p class="text-baltic-blue-400">Registro histórico de todas las transacciones de la plataforma</p>
      </header>
    
      @if (loading()) {
        <div class="flex justify-center py-20">
          <div class="w-12 h-12 border-4 border-baltic-blue-500/20 border-t-baltic-blue-500 rounded-full animate-spin"></div>
        </div>
      }
    
      @if (!loading()) {
        <div class="bg-white/5 backdrop-blur-xl border border-baltic-blue-500/20 rounded-3xl overflow-hidden shadow-2xl">
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-white/5 border-b border-white/5">
                <tr>
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-baltic-blue-400">ID Venta</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-baltic-blue-400">Fecha</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-baltic-blue-400">Cliente</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-baltic-blue-400">Vehículo</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-baltic-blue-400">Estado</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-baltic-blue-400 text-right">Monto</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                @for (s of sales(); track s) {
                  <tr class="hover:bg-white/5 transition-colors group">
                    <td class="px-6 py-4 text-pitch-black-50 font-bold">#{{ s.idVenta }}</td>
                    <td class="px-6 py-4 text-baltic-blue-400 text-sm italic">{{ s.fecha | date:'shortDate' }}</td>
                    <td class="px-6 py-4">
                      <p class="text-pitch-black-50 text-sm font-black">{{ s.cliente.nombre }} {{ s.cliente.apellidos }}</p>
                      <p class="text-baltic-blue-400/60 text-[10px] font-bold">{{ s.cliente.correo }}</p>
                    </td>
                    <td class="px-6 py-4 border-l border-white/5">
                      <p class="text-pitch-black-50 text-sm font-black">{{ s.vehiculo.marca?.nombre }} {{ s.vehiculo.modelo }}</p>
                      <p class="text-baltic-blue-400/60 text-[10px] uppercase font-bold tracking-widest">{{ s.vehiculo.tipoVehiculo }}</p>
                    </td>
                    <td class="px-6 py-4">
                   <span [ngClass]="{
                     'text-emerald-600 bg-emerald-500/10 border-emerald-500/20': s.estadoVenta === 'COMPLETADA',
                     'text-amber-600 bg-amber-500/10 border-amber-500/20': s.estadoVenta === 'PENDIENTE',
                     'text-rose-600 bg-rose-500/10 border-rose-500/20': s.estadoVenta === 'CANCELADA'
                   }" class="px-2 py-0.5 rounded-full text-[10px] font-black border uppercase">
                        {{ s.estadoVenta }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <span class="text-lg font-black text-baltic-blue-500">{{ s.precio | currency:'EUR' }}</span>
                    </td>
                  </tr>
                }
              </tbody>
              <tfoot class="bg-white/5 border-t border-white/5">
                <tr>
                  <td colspan="5" class="px-6 py-4 text-right text-baltic-blue-400 font-black uppercase tracking-widest text-[10px]">Volumen Total</td>
                  <td class="px-6 py-4 text-right text-xl font-black text-baltic-blue-500">{{ totalVolume() | currency:'EUR' }}</td>
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
