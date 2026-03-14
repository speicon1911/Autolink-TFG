import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
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
  imports: [FormsModule],
  template: `
    <div class="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div class="bg-dark-teal-900 border border-baltic-blue-500/20 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-fade-in text-pitch-black-50">
        <header class="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div>
            <h2 class="text-2xl font-black text-pitch-black-50">Registrar Venta</h2>
            <p class="text-baltic-blue-400 text-sm">Vender {{ vehicleToSell.modelo }}</p>
          </div>
          <button (click)="onClose()" class="p-2 hover:bg-white/10 rounded-xl text-baltic-blue-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </header>
    
        <div class="p-6 space-y-6">
          <!-- Step 1: Email search -->
          <div class="space-y-2">
            <label class="text-[10px] font-bold uppercase tracking-wider text-baltic-blue-400 ml-1">
              Correo del Comprador
            </label>
            <div class="flex gap-2">
              <input type="email" [(ngModel)]="emailInput"
                (keyup.enter)="buscarCliente()"
                placeholder="cliente@ejemplo.com"
                class="flex-1 bg-white/10 border-dark-teal-800 rounded-xl px-4 py-3 text-pitch-black-50 focus:ring-2 focus:ring-baltic-blue-500 outline-none transition-all placeholder:text-pitch-black-50/20">
                <button type="button" (click)="buscarCliente()" [disabled]="buscando()"
                  class="bg-baltic-blue-500 hover:bg-baltic-blue-600 disabled:opacity-50 text-white font-bold px-4 py-3 rounded-xl transition-all shadow-md shadow-baltic-blue-500/10">
                  @if (!buscando()) {
                    <span>Buscar</span>
                  }
                  @if (buscando()) {
                    <div class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  }
                </button>
              </div>
    
              <!-- Client not found -->
              @if (clienteNoEncontrado()) {
                <div class="flex items-center gap-2 p-3 bg-rose-50 border border-rose-100 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-rose-500 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <p class="text-rose-600 text-sm">No se encontró ningún cliente con ese correo en el sistema.</p>
                </div>
              }
    
              <!-- Client found -->
              @if (clienteEncontrado()) {
                <div class="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <div class="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 font-black text-lg shrink-0">
                    {{ clienteEncontrado()!.nombre.charAt(0) }}
                  </div>
                  <div>
                    <p class="text-pitch-black-50 font-bold">{{ clienteEncontrado()!.nombre }} {{ clienteEncontrado()!.apellidos }}</p>
                    <p class="text-emerald-500 text-xs">{{ clienteEncontrado()!.correo }}</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-emerald-500 ml-auto shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              }
            </div>
    
            <!-- Step 2: Price (only show when client is found) -->
            @if (clienteEncontrado()) {
              <div class="space-y-1 animate-fade-in">
                <label class="text-[10px] font-bold uppercase tracking-wider text-baltic-blue-400 ml-1">Precio Final de Venta (€)</label>
                <input type="number" [(ngModel)]="precioFinal"
                  class="w-full bg-white/10 border-dark-teal-800 rounded-xl px-4 py-3 text-baltic-blue-500 focus:ring-2 focus:ring-baltic-blue-500 outline-none transition-all font-black text-xl">
                </div>
              }
    
              <!-- Actions -->
              <div class="flex gap-4">
                <button type="button" (click)="onClose()"
                  class="flex-1 bg-dark-teal-50 hover:bg-dark-teal-100 text-dark-teal-700 font-bold py-4 rounded-2xl transition-all">
                  Cancelar
                </button>
                <button type="button" (click)="onSubmit()"
                  [disabled]="!clienteEncontrado() || loading()"
                  class="flex-[2] bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.98] flex items-center justify-center gap-2">
                  @if (!loading()) {
                    <span>Confirmar Venta</span>
                  }
                  @if (loading()) {
                    <div class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  }
                </button>
              </div>
        </div>
      </div>
    </div>
    `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  `]
})
export class SaleFormComponent implements OnInit {
  private authService = inject(AuthService);
  private personaService = inject(PersonaService);
  private ventaService = inject(VentaService);
  private vehicleService = inject(VehicleService);
  private ns = inject(NotificationService);

  @Input() vehicleToSell!: Vehicle;
  @Output() close = new EventEmitter<void>();
  @Output() sold = new EventEmitter<void>();

  loading = signal(false);
  buscando = signal(false);
  clienteEncontrado = signal<User | null>(null);
  clienteNoEncontrado = signal(false);

  emailInput = '';
  precioFinal = 0;
  private todosLosClientes: User[] = [];

  ngOnInit() {
    this.precioFinal = this.vehicleToSell?.precio ?? 0;
    // Load all clients once into memory for local search
    this.personaService.listClientes().subscribe({
      next: (data) => this.todosLosClientes = data
    });
  }

  buscarCliente() {
    if (!this.emailInput.trim()) return;
    this.buscando.set(true);
    this.clienteEncontrado.set(null);
    this.clienteNoEncontrado.set(false);

    // Small delay to feel reactive
    setTimeout(() => {
      const found = this.todosLosClientes.find(
        c => c.correo.toLowerCase() === this.emailInput.trim().toLowerCase()
      );
      if (found) {
        this.clienteEncontrado.set(found);
        this.clienteNoEncontrado.set(false);
      } else {
        this.clienteEncontrado.set(null);
        this.clienteNoEncontrado.set(true);
      }
      this.buscando.set(false);
    }, 400);
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    const cliente = this.clienteEncontrado();
    const user = this.authService.currentUser$();
    if (!cliente || !user) return;

    this.loading.set(true);

    const saleData = {
      fecha: new Date().toISOString().split('T')[0],
      estadoVenta: 'REALIZADA' as any,
      precio: this.precioFinal,
      vendedor: { id: user.id },
      cliente: { id: cliente.id }
    };

    this.ventaService.createVenta(saleData).subscribe({
      next: () => {
        this.vehicleService.updateDisponible(this.vehicleToSell.idVehiculo, false).subscribe({
          next: () => {
            this.ns.success('Venta registrada con éxito');
            this.loading.set(false);
            this.sold.emit();
          },
          error: () => {
            this.ns.error('Venta registrada, pero falló al actualizar la disponibilidad');
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
