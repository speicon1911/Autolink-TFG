import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleService } from '../../../core/services/vehicle.service';
import { AuthService } from '../../../core/services/auth.service';
import { Vehicle } from '../../../core/models/vehicle.model';
import { NotificationService } from '../../../core/services/notification.service';
import { VehicleFormComponent } from './vehicle-form.component';
import { SaleFormComponent } from './sale-form.component';

@Component({
  selector: 'app-seller-stock',
  standalone: true,
  imports: [CommonModule, VehicleFormComponent, SaleFormComponent],
  template: `
    <div class="space-y-6 animate-fade-in">
      <header class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-black text-white">Mi Stock</h1>
          <p class="text-slate-400">Gestiona tus vehículos publicados</p>
        </div>
        <button (click)="onOpenForm()" 
                class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Publicar Vehículo
        </button>
      </header>

      <!-- Vehicle Form Modal -->
      <app-vehicle-form *ngIf="showForm()" 
                        [editMode]="!!editingVehicle()" 
                        [vehicleToEdit]="editingVehicle()"
                        (close)="onCloseForm()" 
                        (saved)="onVehicleSaved()">
      </app-vehicle-form>

      <!-- Sale Form Modal -->
      <app-sale-form *ngIf="sellingVehicle()"
                     [vehicleToSell]="sellingVehicle()!"
                     (close)="onCloseSale()"
                     (sold)="onVehicleSold()">
      </app-sale-form>

      <div *ngIf="loading()" class="flex justify-center py-20">
        <div class="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      </div>

      <div *ngIf="!loading() && vehicles().length === 0" class="text-center py-20 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800">
        <p class="text-slate-500">No tienes vehículos publicados actualmente.</p>
      </div>

      <div *ngIf="!loading() && vehicles().length > 0" class="grid gap-4">
        <div *ngFor="let v of vehicles()" 
             class="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between gap-6 hover:border-slate-700 transition-all shadow-xl">
          <div class="flex items-center gap-4">
             <div class="w-16 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
             </div>
             <div>
                <h3 class="text-white font-bold">{{ v.modelo }}</h3>
                <div class="flex items-center gap-2">
                   <span class="text-xs font-bold px-2 py-0.5 rounded-full" 
                         [ngClass]="v.disponible ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-500'">
                     {{ v.disponible ? 'Disponible' : 'Vendido' }}
                   </span>
                   <span *ngIf="v.verificado" class="text-[10px] text-blue-400 font-black uppercase tracking-widest">Verificado</span>
                </div>
             </div>
          </div>

          <div class="flex items-center gap-8">
             <div class="text-right">
                <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Precio</p>
                <p class="text-xl font-black text-white">{{ v.precio | currency:'EUR' }}</p>
             </div>
             <div class="flex items-center gap-2">
                <button *ngIf="v.disponible" (click)="onOpenSale(v)" class="p-2 hover:bg-emerald-900/20 rounded-lg text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-1 text-xs font-bold" title="Vender">
                   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                   Vender
                </button>
                <button (click)="onEdit(v)" class="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                </button>
                <button (click)="onDelete(v.idVehiculo)" class="p-2 hover:bg-red-900/20 rounded-lg text-slate-400 hover:text-red-500 transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
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
export class SellerStockComponent implements OnInit {
  private vehicleService = inject(VehicleService);
  private authService = inject(AuthService);
  private ns = inject(NotificationService);

  vehicles = signal<Vehicle[]>([]);
  loading = signal(true);
  showForm = signal(false);
  editingVehicle = signal<Vehicle | null>(null);
  sellingVehicle = signal<Vehicle | null>(null);

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
      this.vehicleService.getVehiculosPorVendedor(user.id).subscribe({
        next: (data) => {
          this.vehicles.set(data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    }
  }

  onDelete(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este vehículo?')) {
      this.vehicleService.deleteVehiculo(id).subscribe({
        next: () => {
          this.ns.success('Vehículo eliminado con éxito');
          this.cargarStock();
        }
      });
    }
  }

  onEdit(v: Vehicle) {
    this.editingVehicle.set(v);
    this.showForm.set(true);
  }

  onOpenSale(v: Vehicle) {
    this.sellingVehicle.set(v);
  }

  onCloseSale() {
    this.sellingVehicle.set(null);
  }

  onVehicleSold() {
    this.sellingVehicle.set(null);
    this.cargarStock();
  }
}
