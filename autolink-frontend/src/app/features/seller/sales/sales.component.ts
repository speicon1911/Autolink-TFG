import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentaService } from '../../../core/services/venta.service';
import { AuthService } from '../../../core/services/auth.service';
import { Sale } from '../../../core/models/sale.model';

@Component({
    selector: 'app-seller-sales',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-6 animate-fade-in">
      <header>
        <h1 class="text-3xl font-black text-white">Mis Ventas</h1>
        <p class="text-slate-400">Seguimiento de tus operaciones cerradas</p>
      </header>

      <div *ngIf="loading()" class="flex justify-center py-20">
        <div class="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      </div>

      <div *ngIf="!loading() && sales().length === 0" class="text-center py-20 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800">
        <p class="text-slate-500 text-lg">Aún no has registrado ninguna venta.</p>
      </div>

      <div *ngIf="!loading() && sales().length > 0" class="grid gap-4">
        <div *ngFor="let s of sales()" 
             class="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between gap-6 hover:border-slate-700 shadow-xl transition-all">
          <div class="flex items-center gap-5">
            <div class="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
               <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5-3"/><path d="M22 12H2"/></svg>
            </div>
            <div class="space-y-1">
               <h3 class="text-white font-bold text-lg">Venta #{{ s.idVenta }}</h3>
               <p class="text-slate-500 text-sm">Cliente: {{ s.cliente.nombre }} {{ s.cliente.apellidos }}</p>
            </div>
          </div>

          <div class="flex items-center gap-8">
             <div class="text-right">
                <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Fecha</p>
                <p class="text-sm text-white font-medium">{{ s.fecha | date:'mediumDate':'':'es' }}</p>
             </div>
             <div class="text-right">
                <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Precio de Venta</p>
                <p class="text-2xl font-black text-emerald-500">{{ s.precio | currency:'EUR' }}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class SellerSalesComponent implements OnInit {
    private ventaService = inject(VentaService);
    private authService = inject(AuthService);

    sales = signal<Sale[]>([]);
    loading = signal(true);

    ngOnInit() {
        const user = this.authService.currentUser$();
        if (user) {
            this.ventaService.getSalesByVendedor(user.id).subscribe({
                next: (data) => {
                    this.sales.set(data);
                    this.loading.set(false);
                },
                error: () => this.loading.set(false)
            });
        }
    }
}
