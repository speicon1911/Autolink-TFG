import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { VehicleService } from '../../../core/services/vehicle.service';
import { Vehicle, Marca, TipoVehiculo, CombustibleVehiculo, EtiquetaMedioambiental, EstadoVerificacion } from '../../../core/models/vehicle.model';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { FormatEnumPipe } from '../../../shared/pipes/format-enum.pipe';
import { ImagenVehiculo } from '../../../core/models/vehicle.model';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormatEnumPipe, ConfirmModalComponent],
  template: `
    <div class="fixed inset-0 bg-surface-base/85 z-50 flex items-center justify-center p-4">
      <div class="bg-surface-card border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-fade-in text-content-primary">
        <header class="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div>
            <h2 class="text-2xl font-black text-content-primary">{{ editMode ? 'Editar' : 'Publicar' }} Vehículo</h2>
            <p class="text-action-primary text-sm">Completa los detalles técnicos del vehículo</p>
          </div>
          <button (click)="onClose()" class="p-2 hover:bg-white/10 rounded-xl text-content-secondary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </header>
    
        <form [formGroup]="vehicleForm" (ngSubmit)="onSubmit()" class="p-6 overflow-y-auto space-y-6">
          <!-- Basic Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-action-primary ml-1">Marca</label>
              <select formControlName="id_marca"
                class="w-full bg-surface-base border border-white/10 rounded-xl px-4 py-2.5 text-content-primary focus:ring-2 focus:ring-action-primary outline-none transition-all cursor-pointer"
                [class.border-feedback-error]="isFieldInvalid('id_marca')">
                <option [value]="null">Selecciona una marca</option>
                @for (m of marcas(); track m) {
                  <option [value]="m.idMarca">{{ m.nombre | formatEnum }}</option>
                }
              </select>
              @if (isFieldInvalid('id_marca')) {
                <p class="text-[9px] text-feedback-error font-bold ml-1 animate-pulse">{{ getErrorMessage('id_marca') }}</p>
              }
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-action-primary ml-1">Modelo</label>
              <input type="text" formControlName="modelo" placeholder="Ej: Golf GTI"
                class="w-full bg-surface-base border border-white/10 rounded-xl px-4 py-2.5 text-content-primary focus:ring-2 focus:ring-action-primary outline-none transition-all placeholder:text-content-muted"
                [class.border-feedback-error]="isFieldInvalid('modelo')">
                @if (isFieldInvalid('modelo')) {
                  <p class="text-[9px] text-feedback-error font-bold ml-1 animate-pulse">{{ getErrorMessage('modelo') }}</p>
                }
              </div>
            </div>
    
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-action-primary ml-1">Tipo de Vehículo</label>
                <select formControlName="tipoVehiculo"
                  class="w-full bg-surface-base border border-white/10 rounded-xl px-4 py-2.5 text-content-primary focus:ring-2 focus:ring-action-primary outline-none transition-all cursor-pointer"
                  [class.border-feedback-error]="isFieldInvalid('tipoVehiculo')">
                  @for (t of tipos; track t) {
                    <option [value]="t">{{ t | formatEnum }}</option>
                  }
                </select>
                @if (isFieldInvalid('tipoVehiculo')) {
                  <p class="text-[9px] text-feedback-error font-bold ml-1 animate-pulse">{{ getErrorMessage('tipoVehiculo') }}</p>
                }
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-action-primary ml-1">Combustible</label>
                <select formControlName="combustible"
                  class="w-full bg-surface-base border border-white/10 rounded-xl px-4 py-2.5 text-content-primary focus:ring-2 focus:ring-action-primary outline-none transition-all cursor-pointer"
                  [class.border-feedback-error]="isFieldInvalid('combustible')">
                  @for (c of combustibles; track c) {
                    <option [value]="c">{{ c | formatEnum }}</option>
                  }
                </select>
                @if (isFieldInvalid('combustible')) {
                  <p class="text-[9px] text-feedback-error font-bold ml-1 animate-pulse">{{ getErrorMessage('combustible') }}</p>
                }
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-action-primary ml-1">Año Fabricación</label>
                <input type="number" formControlName="anioFabricacion" placeholder="Ej: 2024" min="1900" max="2100"
                  class="w-full bg-surface-base border border-white/10 rounded-xl px-4 py-2.5 text-content-primary focus:ring-2 focus:ring-action-primary outline-none transition-all"
                  [class.border-feedback-error]="isFieldInvalid('anioFabricacion')">
                  @if (isFieldInvalid('anioFabricacion')) {
                    <p class="text-[9px] text-feedback-error font-bold ml-1 animate-pulse">{{ getErrorMessage('anioFabricacion') }}</p>
                  }
                </div>
              </div>
    
              <!-- Specs -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-action-primary ml-1">Precio (€)</label>
                  <input type="number" formControlName="precio"
                    class="w-full bg-surface-base border border-white/10 rounded-xl px-4 py-2.5 text-content-primary focus:ring-2 focus:ring-action-primary outline-none transition-all"
                    [class.border-feedback-error]="isFieldInvalid('precio')">
                    @if (isFieldInvalid('precio')) {
                      <p class="text-[9px] text-feedback-error font-bold ml-1 animate-pulse">{{ getErrorMessage('precio') }}</p>
                    }
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-action-primary ml-1">Kilometraje</label>
                    <input type="number" formControlName="kilometraje"
                      class="w-full bg-surface-base border border-white/10 rounded-xl px-4 py-2.5 text-content-primary focus:ring-2 focus:ring-action-primary outline-none transition-all"
                      [class.border-feedback-error]="isFieldInvalid('kilometraje')">
                      @if (isFieldInvalid('kilometraje')) {
                        <p class="text-[9px] text-feedback-error font-bold ml-1 animate-pulse">{{ getErrorMessage('kilometraje') }}</p>
                      }
                    </div>
                    <div class="space-y-1">
                      <label class="text-[10px] font-bold uppercase tracking-wider text-action-primary ml-1">Potencia (CV)</label>
                      <input type="number" formControlName="potencia"
                        class="w-full bg-surface-base border border-white/10 rounded-xl px-4 py-2.5 text-content-primary focus:ring-2 focus:ring-action-primary outline-none transition-all"
                        [class.border-feedback-error]="isFieldInvalid('potencia')">
                        @if (isFieldInvalid('potencia')) {
                          <p class="text-[9px] text-feedback-error font-bold ml-1 animate-pulse">{{ getErrorMessage('potencia') }}</p>
                        }
                      </div>
                      <div class="space-y-1">
                        <label class="text-[10px] font-bold uppercase tracking-wider text-action-primary ml-1">Color</label>
                        <input type="text" formControlName="color" placeholder="Blanco"
                          class="w-full bg-surface-base border border-white/10 rounded-xl px-4 py-2.5 text-content-primary focus:ring-2 focus:ring-action-primary outline-none transition-all placeholder:text-content-muted"
                          [class.border-feedback-error]="isFieldInvalid('color')">
                          @if (isFieldInvalid('color')) {
                            <p class="text-[9px] text-feedback-error font-bold ml-1 animate-pulse">{{ getErrorMessage('color') }}</p>
                          }
                        </div>
                      </div>
    
                      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div class="space-y-1">
                          <label class="text-[10px] font-bold uppercase tracking-wider text-action-primary ml-1">Plazas</label>
                          <input type="number" formControlName="plazas"
                            class="w-full bg-surface-base border border-white/10 rounded-xl px-4 py-2.5 text-content-primary focus:ring-2 focus:ring-action-primary outline-none transition-all"
                            [class.border-feedback-error]="isFieldInvalid('plazas')">
                            @if (isFieldInvalid('plazas')) {
                              <p class="text-[9px] text-feedback-error font-bold ml-1 animate-pulse">{{ getErrorMessage('plazas') }}</p>
                            }
                          </div>
                          <div class="space-y-1">
                            <label class="text-[10px] font-bold uppercase tracking-wider text-action-primary ml-1">Puertas</label>
                            <input type="number" formControlName="puertas"
                              class="w-full bg-surface-base border border-white/10 rounded-xl px-4 py-2.5 text-content-primary focus:ring-2 focus:ring-action-primary outline-none transition-all"
                              [class.border-feedback-error]="isFieldInvalid('puertas')">
                              @if (isFieldInvalid('puertas')) {
                                <p class="text-[9px] text-feedback-error font-bold ml-1 animate-pulse">{{ getErrorMessage('puertas') }}</p>
                              }
                        </div>
                      </div>
 
                        <!-- Technical Expansion -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                          <div class="space-y-1">
                            <label class="text-[10px] font-bold uppercase tracking-wider text-action-primary ml-1">Matrícula</label>
                            <input type="text" formControlName="matricula" placeholder="1234BBB"
                              class="w-full bg-surface-base border border-white/10 rounded-xl px-4 py-2.5 text-content-primary focus:ring-2 focus:ring-action-primary outline-none transition-all"
                              [class.border-feedback-error]="isFieldInvalid('matricula')">
                            <p class="text-[8px] text-content-muted ml-1 italic">Formato: 1234BBB o Provincial</p>
                            @if (isFieldInvalid('matricula')) {
                              <p class="text-[9px] text-feedback-error font-bold ml-1 animate-pulse">{{ getErrorMessage('matricula') }}</p>
                            }
                          </div>
                          <div class="space-y-1">
                            <label class="text-[10px] font-bold uppercase tracking-wider text-action-primary ml-1">Distintivo Ambiental DGT</label>
                            <select formControlName="etiquetaMedioambiental"
                              class="w-full bg-surface-base border border-white/10 rounded-xl px-4 py-2.5 text-content-primary focus:ring-2 focus:ring-action-primary outline-none transition-all cursor-pointer"
                              [class.border-feedback-error]="isFieldInvalid('etiquetaMedioambiental')">
                              @for (e of etiquetas; track e) {
                                <option [value]="e">{{ e | formatEnum }}</option>
                              }
                            </select>
                            @if (isFieldInvalid('etiquetaMedioambiental')) {
                              <p class="text-[9px] text-feedback-error font-bold ml-1 animate-pulse">{{ getErrorMessage('etiquetaMedioambiental') }}</p>
                            }
                          </div>
                        </div>
 
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div class="space-y-1">
                            <label class="text-[10px] font-bold uppercase tracking-wider text-action-primary ml-1">Fecha 1ª Matriculación</label>
                            <input type="date" formControlName="fechaMatriculacion"
                              class="w-full bg-surface-base border border-white/10 rounded-xl px-4 py-2.5 text-content-primary focus:ring-2 focus:ring-action-primary outline-none transition-all"
                              [class.border-feedback-error]="isFieldInvalid('fechaMatriculacion')">
                              @if (isFieldInvalid('fechaMatriculacion')) {
                                <p class="text-[9px] text-feedback-error font-bold ml-1 animate-pulse">{{ getErrorMessage('fechaMatriculacion') }}</p>
                              }
                          </div>
                          <div class="space-y-1">
                            <label class="text-[10px] font-bold uppercase tracking-wider text-action-primary ml-1">Vencimiento ITV</label>
                            <input type="date" formControlName="vencimientoItv"
                              class="w-full bg-surface-base border border-white/10 rounded-xl px-4 py-2.5 text-content-primary focus:ring-2 focus:ring-action-primary outline-none transition-all"
                              [class.border-feedback-error]="isFieldInvalid('vencimientoItv')">
                              @if (isFieldInvalid('vencimientoItv')) {
                                <p class="text-[9px] text-feedback-error font-bold ml-1 animate-pulse">{{ getErrorMessage('vencimientoItv') }}</p>
                              }
                          </div>
                        </div>
 
                        <div class="space-y-1">
                          <label class="text-[10px] font-bold uppercase tracking-wider text-action-primary ml-1">Ubicación (Ciudad)</label>
                          <input type="text" formControlName="ciudad" placeholder="Ej: Madrid, Barcelona..."
                            class="w-full bg-surface-base border border-white/10 rounded-xl px-4 py-2.5 text-content-primary focus:ring-2 focus:ring-action-primary outline-none transition-all"
                            [class.border-feedback-error]="isFieldInvalid('ciudad')">
                            @if (isFieldInvalid('ciudad')) {
                              <p class="text-[9px] text-feedback-error font-bold ml-1 animate-pulse">{{ getErrorMessage('ciudad') }}</p>
                            }
                        </div>
 
                        <div class="space-y-1">
                          <label class="text-[10px] font-bold uppercase tracking-wider text-action-primary ml-1">Descripción Detallada (Opcional)</label>
                          <textarea formControlName="descripcion" rows="4" placeholder="Detalla el estado, revisiones, extras..."
                            class="w-full bg-surface-base border border-white/10 rounded-xl p-4 text-content-primary focus:ring-2 focus:ring-action-primary outline-none transition-all resize-none"
                            [class.border-feedback-error]="isFieldInvalid('descripcion')"></textarea>
                          <div class="flex justify-between">
                            @if (isFieldInvalid('descripcion')) {
                              <p class="text-[9px] text-feedback-error font-bold ml-1 animate-pulse">{{ getErrorMessage('descripcion') }}</p>
                            } @else {
                              <span></span>
                            }
                            <span class="text-[8px] font-bold text-content-muted">{{ vehicleForm.get('descripcion')?.value?.length || 0 }}/1000</span>
                          </div>
                        </div>

                        <div class="flex items-center gap-3 pt-4 pb-2">
                          <input type="checkbox" formControlName="disponible" id="disp"
                            class="w-5 h-5 rounded border-white/10 bg-surface-base text-action-primary focus:ring-action-primary outline-none cursor-pointer">
                          <label for="disp" class="text-sm font-bold text-content-secondary cursor-pointer">Disponible para la venta</label>
                        </div>
    
                            <!-- Gestion de Imagenes -->
                            <div class="space-y-4 pt-4">
                              <div class="flex items-center justify-between">
                                <label class="text-[10px] font-bold uppercase tracking-wider text-action-primary ml-1">Fotos del Vehículo (Máx. 5)</label>
                                <span class="text-[10px] font-bold text-action-primary bg-white/5 px-2 py-1 rounded-md">
                                  {{ (vehicleToEdit?.imagenes?.length || 0) + selectedFiles().length }}/5
                                </span>
                              </div>
                              
                              <div class="grid grid-cols-3 sm:grid-cols-5 gap-3">
                                <!-- Imagenes Existentes -->
                                @for (img of existingImages(); track img.id) {
                                  <div class="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                                    <img [src]="img.url" class="w-full h-full object-cover">
                                    <button type="button" (click)="removeExistingImage(img.id)" 
                                      class="absolute top-1 right-1 p-1 bg-feedback-error text-surface-base rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                    </button>
                                  </div>
                                }
 
                                <!-- Previsualizaciones Nuevas -->
                                @for (p of previews(); track $index) {
                                  <div class="relative aspect-square rounded-xl overflow-hidden border border-action-primary/30 group">
                                    <img [src]="p" class="w-full h-full object-cover">
                                    <button type="button" (click)="removeSelectedFile($index)" 
                                      class="absolute top-1 right-1 p-1 bg-feedback-error text-surface-base rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                    </button>
                                    <div class="absolute bottom-0 inset-x-0 bg-action-primary/80 text-[8px] text-center py-0.5 text-surface-base font-bold">NUEVA</div>
                                  </div>
                                }
 
                                <!-- Boton Añadir -->
                                @if (((existingImages().length + selectedFiles().length) < 5)) {
                                  <label class="aspect-square rounded-xl border-2 border-dashed border-white/10 hover:border-action-primary/50 hover:bg-white/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 text-content-secondary hover:text-action-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                    <span class="text-[8px] font-black uppercase text-center px-1">Añadir Foto</span>
                                    <input type="file" (change)="onFileSelected($event)" accept="image/*" class="hidden" multiple>
                                  </label>
                                }
                              </div>
                              
                              @if (editMode && selectedFiles().length > 0) {
                                <div class="flex justify-end pt-2">
                                  <button type="button" (click)="uploadSelectedPhotos()" [disabled]="loading()"
                                    class="text-[10px] font-black uppercase tracking-widest text-action-primary hover:text-surface-base bg-action-primary/10 hover:bg-action-primary px-4 py-2 rounded-xl border border-action-primary/30 transition-all flex items-center gap-2">
                                    @if (loading()) {
                                      <div class="w-3 h-3 border-2 border-action-primary/20 border-t-action-primary rounded-full animate-spin"></div>
                                      Subiendo...
                                    } @else {
                                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                      Subir Fotos Seleccionadas
                                    }
                                  </button>
                                </div>
                              }
                            </div>
    
                            <div class="flex gap-4 pt-4">
                              <button type="button" (click)="onClose()"
                                class="flex-1 bg-white/10 hover:bg-white/20 text-content-secondary font-bold py-4 rounded-2xl transition-all">
                                Cancelar
                              </button>
                              <button type="submit" [disabled]="loading()"
                                class="flex-[2] btn-primary font-black py-4 rounded-2xl transition-all shadow-xl shadow-action-primary/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                @if (!loading()) {
                                  <span>{{ editMode ? 'Guardar Cambios' : 'Publicar Ahora' }}</span>
                                }
                                @if (loading()) {
                                  <div class="w-5 h-5 border-2 border-surface-base/20 border-t-surface-base rounded-full animate-spin"></div>
                                }
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>

    <!-- Modal de Confirmación -->
    <app-confirm-modal
      [isOpen]="modalConfig().isOpen"
      [title]="modalConfig().title"
      [message]="modalConfig().message"
      (confirmed)="handleModalConfirm()"
      (cancelled)="handleModalCancel()"
    ></app-confirm-modal>
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
  etiquetas = Object.values(EtiquetaMedioambiental);

  vehicleForm = this.fb.group({
    id_marca: [null as number | null, Validators.required],
    modelo: ['', Validators.required],
    tipoVehiculo: [TipoVehiculo.SEDAN, Validators.required],
    combustible: [CombustibleVehiculo.DIESEL, Validators.required],
    anioFabricacion: [new Date().getFullYear(), [Validators.required, Validators.min(1900), Validators.max(2100)]],
    precio: [null as number | null, [Validators.required, Validators.min(0)]],
    kilometraje: [null as number | null, [Validators.required, Validators.min(0)]],
    potencia: [null as number | null, [Validators.required, Validators.min(0)]],
    color: ['', Validators.required],
    plazas: [5, [Validators.required, Validators.min(1)]],
    puertas: [5, [Validators.required, Validators.min(0)]],
    disponible: [true],
    matricula: ['', [Validators.required, Validators.pattern(/^[0-9]{4}[A-Z]{3}$|^[A-Z]{1,2}[0-9]{4}[A-Z]{1,2}$/)]],
    fechaMatriculacion: ['', Validators.required],
    vencimientoItv: ['', Validators.required],
    etiquetaMedioambiental: [EtiquetaMedioambiental.C, Validators.required],
    descripcion: ['', [Validators.maxLength(1000)]],
    ciudad: ['', Validators.required]
  });

  selectedFiles = signal<File[]>([]);
  previews = signal<string[]>([]);
  existingImages = signal<ImagenVehiculo[]>([]);

  // MODAL DE CONFIRMACIÓN
  modalConfig = signal<{
    isOpen: boolean;
    title: string;
    message: string;
    action: 'deleteImage' | null;
    data: any;
  }>({
    isOpen: false,
    title: '',
    message: '',
    action: null,
    data: null
  });

  ngOnInit() {
    this.cargarMarcas();
    if (this.editMode && this.vehicleToEdit) {
      this.existingImages.set(this.vehicleToEdit.imagenes || []);
      this.vehicleForm.patchValue({
        id_marca: this.vehicleToEdit.marca?.idMarca || null,
        modelo: this.vehicleToEdit.modelo,
        tipoVehiculo: this.vehicleToEdit.tipoVehiculo,
        combustible: this.vehicleToEdit.combustible,
        anioFabricacion: this.vehicleToEdit.anioFabricacion,
        precio: this.vehicleToEdit.precio,
        kilometraje: this.vehicleToEdit.kilometraje,
        potencia: this.vehicleToEdit.potencia,
        color: this.vehicleToEdit.color,
        plazas: this.vehicleToEdit.plazas,
        puertas: this.vehicleToEdit.puertas,
        disponible: this.vehicleToEdit.disponible,
        matricula: this.vehicleToEdit.matricula,
        fechaMatriculacion: this.vehicleToEdit.fechaMatriculacion,
        vencimientoItv: this.vehicleToEdit.vencimientoItv,
        etiquetaMedioambiental: this.vehicleToEdit.etiquetaMedioambiental,
        descripcion: this.vehicleToEdit.descripcion,
        ciudad: this.vehicleToEdit.ciudad
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
    if (this.vehicleForm.invalid) {
      this.vehicleForm.markAllAsTouched();
      this.ns.error('Por favor, completa todos los campos obligatorios correctamente');
      return;
    }

    this.loading.set(true);
    const user = this.authService.currentUser$();
    if (!user) {
      this.ns.error('Debes estar autenticado para realizar esta acción');
      this.loading.set(false);
      return;
    }

      const formVal: any = this.vehicleForm.value;

      // Validación extra: Fecha matriculación >= Año fabricación
      const matriculacionYear = new Date(formVal.fechaMatriculacion).getUTCFullYear();
      if (matriculacionYear < formVal.anioFabricacion) {
        this.ns.error(`La fecha de matriculación no puede ser anterior al año de fabricación (${formVal.anioFabricacion})`);
        this.loading.set(false);
        return;
      }

      // Clean up payload based on backend entity structure
      const vehicleData: any = {
        precio: formVal.precio,
        plazas: formVal.plazas,
        potencia: formVal.potencia,
        puertas: formVal.puertas,
        kilometraje: formVal.kilometraje,
        color: formVal.color,
        modelo: formVal.modelo,
        anioFabricacion: formVal.anioFabricacion,
        tipoVehiculo: formVal.tipoVehiculo,
        combustible: formVal.combustible,
        disponible: formVal.disponible,
        verificado: EstadoVerificacion.PENDIENTE,
        marca: { idMarca: formVal.id_marca },
        vendedor: { id: user.id },
        matricula: formVal.matricula,
        fechaMatriculacion: formVal.fechaMatriculacion,
        vencimientoItv: formVal.vencimientoItv,
        etiquetaMedioambiental: formVal.etiquetaMedioambiental,
        descripcion: formVal.descripcion,
        ciudad: formVal.ciudad
      };

      const request = this.editMode && this.vehicleToEdit
        ? this.vehicleService.updateVehiculo(this.vehicleToEdit.idVehiculo, vehicleData)
        : this.vehicleService.createVehiculo(vehicleData);

      request.subscribe({
        next: (savedVehicle) => {
          // Si hay archivos seleccionados, los subimos ahora
          if (this.selectedFiles().length > 0) {
            const vehicleId = this.editMode ? this.vehicleToEdit!.idVehiculo : savedVehicle.idVehiculo;
            this.vehicleService.uploadImages(vehicleId, this.selectedFiles()).subscribe({
              next: () => {
                this.finishSubmit();
              },
              error: (err) => {
                console.error('Error al subir imágenes:', err);
                this.ns.error('Vehículo guardado, pero hubo un error al subir las fotos');
                this.finishSubmit();
              }
            });
          } else {
            this.finishSubmit();
          }
        },
        error: (err) => {
          console.error('Error al guardar vehículo:', err);
          this.loading.set(false);
          
          let errorMsg = 'Error inesperado al procesar la solicitud';
          
          if (err.status === 409) {
            // Caso específico para matrícula duplicada
            errorMsg = typeof err.error === 'string' ? err.error : (err.error?.message || 'Ya existe un vehículo con esta matrícula.');
          } else if (typeof err.error === 'string' && err.error.length < 200) {
            errorMsg = err.error;
          } else if (err.error?.message) {
            errorMsg = err.error.message;
          }

          this.ns.error(errorMsg);
        }
      });
  }

  private finishSubmit() {
    this.ns.success(this.editMode ? 'Vehículo actualizado' : 'Vehículo publicado con éxito');
    this.loading.set(false);
    this.saved.emit();
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (!files) return;

    const totalActual = this.existingImages().length + this.selectedFiles().length;
    const disponibles = 5 - totalActual;

    if (disponibles <= 0) {
      this.ns.error('Ya has alcanzado el límite de 5 imágenes');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB

    const validFiles: File[] = [];
    Array.from(files).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        this.ns.error(`El archivo ${file.name} no es una imagen válida (solo JPG, PNG, WEBP).`);
        return;
      }
      if (file.size > maxSizeBytes) {
        this.ns.error(`La imagen ${file.name} supera el límite de 5MB.`);
        return;
      }
      validFiles.push(file);
    });

    const filesToUpload = validFiles.slice(0, disponibles);
    
    filesToUpload.forEach(file => {
      this.selectedFiles.update(current => [...current, file]);
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previews.update(current => [...current, e.target.result]);
      };
      reader.readAsDataURL(file);
    });

    if (validFiles.length > disponibles) {
      this.ns.warning(`Solo se han añadido las primeras ${disponibles} imágenes para no exceder el límite de 5.`);
    }
  }

  removeSelectedFile(index: number) {
    this.selectedFiles.update(current => current.filter((_, i) => i !== index));
    this.previews.update(current => current.filter((_, i) => i !== index));
  }

  removeExistingImage(id: number) {
    this.modalConfig.set({
      isOpen: true,
      title: 'Eliminar Imagen',
      message: '¿Estás seguro de que quieres eliminar esta imagen de forma permanente? Esta acción no se puede deshacer.',
      action: 'deleteImage',
      data: id
    });
  }

  handleModalConfirm() {
    const config = this.modalConfig();
    if (!config.action) return;

    if (config.action === 'deleteImage') {
      const id = config.data as number;
      this.vehicleService.deleteImage(id).subscribe({
        next: () => {
          this.existingImages.update(current => current.filter(img => img.id !== id));
          this.ns.success('Imagen eliminada');
          this.closeConfirmModal();
        },
        error: () => {
          this.ns.error('Error al eliminar la imagen');
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

  uploadSelectedPhotos() {
    if (!this.vehicleToEdit) return;
    this.loading.set(true);
    this.vehicleService.uploadImages(this.vehicleToEdit.idVehiculo, this.selectedFiles()).subscribe({
      next: (updatedVehicle) => {
        this.ns.success('Fotos subidas con éxito');
        this.existingImages.set(updatedVehicle.imagenes || []);
        this.selectedFiles.set([]);
        this.previews.set([]);
        this.loading.set(false);
        this.saved.emit(); // Opcional, para refrescar la lista detrás
      },
      error: (err) => {
        console.error('Error al subir fotos:', err);
        this.ns.error('Error al subir las fotos');
        this.loading.set(false);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.vehicleForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.vehicleForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'Este campo es obligatorio';
    if (field.errors['min']) return `Valor mínimo: ${field.errors['min'].min}`;
    if (field.errors['max']) return `Valor máximo: ${field.errors['max'].max}`;
    if (field.errors['pattern']) {
      if (fieldName === 'matricula') return 'Formato de matrícula no válido (ej: 1234BBB)';
      return 'Formato no válido';
    }
    if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;

    return 'Campo no válido';
  }
}
