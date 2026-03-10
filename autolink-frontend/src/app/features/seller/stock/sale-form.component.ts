import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Vehicle } from '../../../core/models/vehicle.model';
import { User } from '../../../core/models/user.model';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { PersonaService } from '../../../core/services/persona.service';
import { VentaService } from '../../../core/services/venta.service';
import { VehicleService } from '../../../core/services/vehicle.service';

@Component({
    selector: 'app-sale-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
        <header class="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div>
            <h2 class="text-2xl font-black text-white">Registrar Venta</h2>
            <p class="text-slate-400 text-sm">Vender {{ vehicleToSell.modelo }}</p>
          </div>
          <button (click)="onClose()" class="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </header>

        <form [formGroup]="saleForm" (ngSubmit)="onSubmit()" class="p-6 space-y-6">
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Cliente</label>
            <select formControlName="idCliente" 
                    class="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
              <option [value]="null">Selecciona el comprador</option>
              <option *ngFor="let c of clientes()" [value]="c.id">{{ c.nombre }} {{ c.apellidos }} ({{ c.correo }})</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Precio Final de Venta (€)</label>
            <input type="number" formControlName="precio" 
                   class="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-black text-xl">
          </div>

          <div class="flex gap-4 pt-4">
            <button type="button" (click)="onClose()"
                    class="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all">
              Cancelar
            </button>
            <button type="submit" [disabled]="saleForm.invalid || loading()"
                    class="flex-[2] bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.98] flex items-center justify-center gap-2">
              <span *ngIf="!loading()">Confirmar Venta</span>
              <div *ngIf="loading()" class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
    styles: [`
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  `]
})
export class SaleFormComponent implements OnInit {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private personaService = inject(PersonaService);
    private ventaService = inject(VentaService);
    private vehicleService = inject(VehicleService);
    private ns = inject(NotificationService);

    @Input() vehicleToSell!: Vehicle;
    @Output() close = new EventEmitter<void>();
    @Output() sold = new EventEmitter<void>();

    loading = signal(false);
    clientes = signal<User[]>([]);

    saleForm = this.fb.group({
        idCliente: [null as number | null, Validators.required],
        precio: [0, [Validators.required, Validators.min(0)]]
    });

    ngOnInit() {
        this.cargarClientes();
        if (this.vehicleToSell) {
            this.saleForm.patchValue({
                precio: this.vehicleToSell.precio
            });
        }
    }

    cargarClientes() {
        this.personaService.listClientes().subscribe({
            next: (data) => this.clientes.set(data),
            error: () => this.ns.error('Error al cargar la lista de clientes')
        });
    }

    onClose() {
        this.close.emit();
    }

    onSubmit() {
        if (this.saleForm.valid && this.vehicleToSell) {
            this.loading.set(true);
            const user = this.authService.currentUser$();
            const formVal = this.saleForm.value;

            if (!user) return;

            const saleData = {
                fecha: new Date().toISOString().split('T')[0],
                estadoVenta: 'REALIZADA' as any, // Using string matching enum backend
                precio: formVal.precio!,
                vendedor: { id: user.id },
                cliente: { id: formVal.idCliente! }
            };

            this.ventaService.createVenta(saleData).subscribe({
                next: () => {
                    // Mark vehicle as not available
                    this.vehicleService.updateDisponible(this.vehicleToSell.idVehiculo, false).subscribe({
                        next: () => {
                            this.ns.success('Venta registrada con éxito');
                            this.loading.set(false);
                            this.sold.emit();
                        },
                        error: (err) => {
                            this.ns.error('Venta registrada, pero falló la actualización del vehículo');
                            this.loading.set(false);
                            this.sold.emit();
                        }
                    });
                },
                error: (err) => {
                    this.ns.error(err.error?.message || 'Error al registrar la venta');
                    this.loading.set(false);
                }
            });
        }
    }
}
