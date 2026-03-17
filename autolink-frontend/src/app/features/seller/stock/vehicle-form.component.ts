import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { VehicleService } from '../../../core/services/vehicle.service';
import { Vehicle, Marca, TipoVehiculo, CombustibleVehiculo } from '../../../core/models/vehicle.model';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { FormatEnumPipe } from '../../../shared/pipes/format-enum.pipe';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormatEnumPipe],
  template: `
    <div class="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div class="bg-dark-teal-900 border border-baltic-blue-500/20 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-fade-in text-pitch-black-50">
        <header class="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div>
            <h2 class="text-2xl font-black text-pitch-black-50">{{ editMode ? 'Editar' : 'Publicar' }} Vehículo</h2>
            <p class="text-baltic-blue-400 text-sm">Completa los detalles técnicos del vehículo</p>
          </div>
          <button (click)="onClose()" class="p-2 hover:bg-white/10 rounded-xl text-baltic-blue-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </header>
    
        <form [formGroup]="vehicleForm" (ngSubmit)="onSubmit()" class="p-6 overflow-y-auto space-y-6">
          <!-- Basic Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-baltic-blue-400 ml-1">Marca</label>
              <select formControlName="id_marca"
                class="w-full bg-white/10 border-dark-teal-800 rounded-xl px-4 py-2.5 text-pitch-black-50 focus:ring-2 focus:ring-baltic-blue-500 outline-none transition-all appearance-none">
                <option [value]="null" class="bg-dark-teal-900">Selecciona una marca</option>
                @for (m of marcas(); track m) {
                  <option [value]="m.idMarca" class="bg-dark-teal-900">{{ m.nombre | formatEnum }}</option>
                }
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-baltic-blue-400 ml-1">Modelo</label>
              <input type="text" formControlName="modelo" placeholder="Ej: Golf GTI"
                class="w-full bg-white/10 border-dark-teal-800 rounded-xl px-4 py-2.5 text-pitch-black-50 focus:ring-2 focus:ring-baltic-blue-500 outline-none transition-all placeholder:text-pitch-black-50/20">
              </div>
            </div>
    
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-baltic-blue-400 ml-1">Tipo de Vehículo</label>
                <select formControlName="tipoVehiculo"
                  class="w-full bg-white/10 border-dark-teal-800 rounded-xl px-4 py-2.5 text-pitch-black-50 focus:ring-2 focus:ring-baltic-blue-500 outline-none transition-all appearance-none">
                  @for (t of tipos; track t) {
                    <option [value]="t" class="bg-dark-teal-900">{{ t | formatEnum }}</option>
                  }
                </select>
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-baltic-blue-400 ml-1">Combustible</label>
                <select formControlName="combustible"
                  class="w-full bg-white/10 border-dark-teal-800 rounded-xl px-4 py-2.5 text-pitch-black-50 focus:ring-2 focus:ring-baltic-blue-500 outline-none transition-all appearance-none">
                  @for (c of combustibles; track c) {
                    <option [value]="c" class="bg-dark-teal-900">{{ c | formatEnum }}</option>
                  }
                </select>
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-baltic-blue-400 ml-1">Fecha Fabricación</label>
                <input type="date" formControlName="fechaFabricacion"
                  class="w-full bg-white/10 border-dark-teal-800 rounded-xl px-4 py-2.5 text-pitch-black-50 focus:ring-2 focus:ring-baltic-blue-500 outline-none transition-all">
                </div>
              </div>
    
              <!-- Specs -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-baltic-blue-400 ml-1">Precio (€)</label>
                  <input type="number" formControlName="precio"
                    class="w-full bg-white/10 border-dark-teal-800 rounded-xl px-4 py-2.5 text-pitch-black-50 focus:ring-2 focus:ring-baltic-blue-500 outline-none transition-all">
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-baltic-blue-400 ml-1">Kilometraje</label>
                    <input type="number" formControlName="kilometraje"
                      class="w-full bg-white/10 border-dark-teal-800 rounded-xl px-4 py-2.5 text-pitch-black-50 focus:ring-2 focus:ring-baltic-blue-500 outline-none transition-all">
                    </div>
                    <div class="space-y-1">
                      <label class="text-[10px] font-bold uppercase tracking-wider text-baltic-blue-400 ml-1">Potencia (CV)</label>
                      <input type="number" formControlName="potencia"
                        class="w-full bg-white/10 border-dark-teal-800 rounded-xl px-4 py-2.5 text-pitch-black-50 focus:ring-2 focus:ring-baltic-blue-500 outline-none transition-all">
                      </div>
                      <div class="space-y-1">
                        <label class="text-[10px] font-bold uppercase tracking-wider text-baltic-blue-400 ml-1">Color</label>
                        <input type="text" formControlName="color" placeholder="Blanco"
                          class="w-full bg-white/10 border-dark-teal-800 rounded-xl px-4 py-2.5 text-pitch-black-50 focus:ring-2 focus:ring-baltic-blue-500 outline-none transition-all placeholder:text-pitch-black-50/20">
                        </div>
                      </div>
    
                      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div class="space-y-1">
                          <label class="text-[10px] font-bold uppercase tracking-wider text-baltic-blue-400 ml-1">Plazas</label>
                          <input type="number" formControlName="plazas"
                            class="w-full bg-white/10 border-dark-teal-800 rounded-xl px-4 py-2.5 text-pitch-black-50 focus:ring-2 focus:ring-baltic-blue-500 outline-none transition-all">
                          </div>
                          <div class="space-y-1">
                            <label class="text-[10px] font-bold uppercase tracking-wider text-baltic-blue-400 ml-1">Puertas</label>
                            <input type="number" formControlName="puertas"
                              class="w-full bg-white/10 border-dark-teal-800 rounded-xl px-4 py-2.5 text-pitch-black-50 focus:ring-2 focus:ring-baltic-blue-500 outline-none transition-all">
                            </div>
                            <div class="flex items-center gap-3 pt-6">
                              <input type="checkbox" formControlName="disponible" id="disp"
                                class="w-5 h-5 rounded border-dark-teal-800 bg-white/10 text-baltic-blue-500 focus:ring-baltic-blue-500 outline-none cursor-pointer">
                                <label for="disp" class="text-sm font-bold text-baltic-blue-400 cursor-pointer">Disponible</label>
                              </div>
                            </div>
    
                            <div class="flex gap-4 pt-4">
                              <button type="button" (click)="onClose()"
                                class="flex-1 bg-white/10 hover:bg-white/20 text-baltic-blue-300 font-bold py-4 rounded-2xl transition-all">
                                Cancelar
                              </button>
                              <button type="submit" [disabled]="vehicleForm.invalid || loading()"
                                class="flex-[2] btn-primary text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-baltic-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-2">
                                @if (!loading()) {
                                  <span>{{ editMode ? 'Guardar Cambios' : 'Publicar Ahora' }}</span>
                                }
                                @if (loading()) {
                                  <div class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                }
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
export class VehicleFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private vehicleService = inject(VehicleService);
  private authService = inject(AuthService);
  private ns = inject(NotificationService);

  @Input() editMode = false;
  @Input() vehicleToEdit: Vehicle | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  loading = signal(false);
  marcas = signal<Marca[]>([]);
  tipos = Object.values(TipoVehiculo);
  combustibles = Object.values(CombustibleVehiculo);

  vehicleForm = this.fb.group({
    id_marca: [null as number | null, Validators.required],
    modelo: ['', Validators.required],
    tipoVehiculo: [TipoVehiculo.SEDAN, Validators.required],
    combustible: [CombustibleVehiculo.DIESEL, Validators.required],
    fechaFabricacion: [new Date().toISOString().split('T')[0], Validators.required],
    precio: [null as number | null, [Validators.required, Validators.min(0)]],
    kilometraje: [null as number | null, [Validators.required, Validators.min(0)]],
    potencia: [null as number | null, [Validators.required, Validators.min(0)]],
    color: ['', Validators.required],
    plazas: [5, [Validators.required, Validators.min(1)]],
    puertas: [5, [Validators.required, Validators.min(0)]],
    disponible: [true]
  });

  ngOnInit() {
    this.cargarMarcas();
    if (this.editMode && this.vehicleToEdit) {
      this.vehicleForm.patchValue({
        id_marca: this.vehicleToEdit.marca?.idMarca || null,
        modelo: this.vehicleToEdit.modelo,
        tipoVehiculo: this.vehicleToEdit.tipoVehiculo,
        combustible: this.vehicleToEdit.combustible,
        fechaFabricacion: this.vehicleToEdit.fechaFabricacion,
        precio: this.vehicleToEdit.precio,
        kilometraje: this.vehicleToEdit.kilometraje,
        potencia: this.vehicleToEdit.potencia,
        color: this.vehicleToEdit.color,
        plazas: this.vehicleToEdit.plazas,
        puertas: this.vehicleToEdit.puertas,
        disponible: this.vehicleToEdit.disponible
      });
    }
  }

  cargarMarcas() {
    this.vehicleService.getMarcas().subscribe(data => {
      const sorted = [...data].sort((a, b) => a.nombre.localeCompare(b.nombre));
      this.marcas.set(sorted);
    });
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    if (this.vehicleForm.valid) {
      this.loading.set(true);
      const user = this.authService.currentUser$();
      if (!user) {
        this.ns.error('Debes estar autenticado para realizar esta acción');
        this.loading.set(false);
        return;
      }

      const formVal: any = this.vehicleForm.value;

      // Clean up payload based on backend entity structure
      const vehicleData: any = {
        precio: formVal.precio,
        plazas: formVal.plazas,
        potencia: formVal.potencia,
        puertas: formVal.puertas,
        kilometraje: formVal.kilometraje,
        color: formVal.color,
        modelo: formVal.modelo,
        fechaFabricacion: formVal.fechaFabricacion,
        tipoVehiculo: formVal.tipoVehiculo,
        combustible: formVal.combustible,
        disponible: formVal.disponible,
        verificado: false,
        marca: { idMarca: formVal.id_marca },
        vendedor: { id: user.id }
      };

      const request = this.editMode && this.vehicleToEdit
        ? this.vehicleService.updateVehiculo(this.vehicleToEdit.idVehiculo, vehicleData)
        : this.vehicleService.createVehiculo(vehicleData);

      request.subscribe({
        next: () => {
          this.ns.success(this.editMode ? 'Vehículo actualizado' : 'Vehículo publicado con éxito');
          this.loading.set(false);
          this.saved.emit();
        },
        error: (err) => {
          console.error('Error al guardar vehículo:', err);
          const errorMsg = err.error?.message || err.message || 'Error desconocido';
          this.ns.error(`Error al procesar la solicitud: ${errorMsg}`);
          this.loading.set(false);
        }
      });
    }
  }
}
