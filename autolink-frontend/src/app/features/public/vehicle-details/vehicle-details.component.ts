import { Component, OnInit, inject, signal, computed, HostListener, model } from '@angular/core';
import { FormatEnumPipe } from '../../../shared/pipes/format-enum.pipe';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Vehicle } from '../../../core/models/vehicle.model';
import { VehicleService } from '../../../core/services/vehicle.service';
import { AuthService } from '../../../core/services/auth.service';
import { VentaService } from '../../../core/services/venta.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Rol } from '../../../core/models/user.model';
import { ContactoService } from '../../../core/services/contacto.service';

@Component({
    selector: 'app-vehicle-details',
    standalone: true,
    imports: [CommonModule, RouterLink, FormatEnumPipe, FormsModule, NgOptimizedImage],
    template: `
    <div class="max-w-6xl mx-auto space-y-12 animate-fade-in py-8 px-4 lg:px-0">
      <!-- Breadcrumb / Back -->
      <nav>
        <a routerLink="/" class="text-action-primary hover:text-action-hover flex items-center gap-2 font-black uppercase tracking-widest text-[10px] transition-colors group">
          <svg class="group-hover:-translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Volver al Catálogo
        </a>
      </nav>
    
      @if (vehicle()) {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Visuals Column -->
          <div class="space-y-6">
            <!-- Imagen Principal / Gallery Trigger -->
            <div 
              class="group/main-img aspect-[16/10] bg-white/5 backdrop-blur-xl rounded-3xl border border-action-primary/20 flex items-center justify-center text-content-muted relative overflow-hidden shadow-2xl cursor-zoom-in"
              (click)="openLightbox()">
              
              @if (vehicle()?.imagenes && vehicle()!.imagenes!.length > 0) {
                <img [ngSrc]="vehicle()!.imagenes![selectedImageIndex()].url" 
                  fill
                  priority
                  class="object-cover group-hover/main-img:scale-105 transition-transform duration-700 ease-out">
                
                <!-- Overlay Gradient -->
                <div class="absolute inset-0 bg-gradient-to-t from-pitch-black/40 via-transparent to-transparent opacity-0 group-hover/main-img:opacity-100 transition-opacity"></div>
                
                <!-- Hint Icon -->
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover/main-img:opacity-100 transition-all scale-90 group-hover/main-img:scale-100 duration-300">
                  <div class="bg-white/10 backdrop-blur-md rounded-full p-4 border border-white/20 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
                  </div>
                </div>
              } @else {
                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-40 animate-pulse"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
              }
              
              <!-- Carousel Arrows (Desktop & Hover only) -->
              @if (vehicle()?.imagenes && vehicle()!.imagenes!.length > 1) {
                <div class="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 pointer-events-none opacity-0 group-hover/main-img:opacity-100 transition-opacity">
                  <button (click)="prevImage($event)" class="pointer-events-auto w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-action-primary hover:border-action-primary transition-all group/btn active:scale-90">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  </button>
                  <button (click)="nextImage($event)" class="pointer-events-auto w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-action-primary hover:border-action-primary transition-all group/btn active:scale-90">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                </div>
              }

              <div class="absolute top-8 right-8 flex flex-col gap-2 items-end pointer-events-none">
                @if (vehicle()?.verificado) {
                  <div class="bg-action-primary text-surface-base font-black px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 text-xs border border-action-primary/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    VERIFICADO
                  </div>
                }
                @if (!vehicle()?.disponible) {
                  <div class="bg-rose-600 text-white font-black px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 text-xs border border-rose-500">
                    VENDIDO
                  </div>
                }
              </div>
            </div>

            <!-- Miniaturas Slider -->
            @if (vehicle()?.imagenes && vehicle()!.imagenes!.length > 1) {
              <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                @for (img of vehicle()!.imagenes; track img.id) {
                  <button (click)="selectedImageIndex.set($index)"
                    class="flex-shrink-0 w-24 h-20 rounded-2xl overflow-hidden border-2 transition-all relative group"
                    [class.border-action-primary]="selectedImageIndex() === $index"
                    [class.border-white/10]="selectedImageIndex() !== $index">
                    <img [ngSrc]="img.url" fill class="object-cover">
                    <!-- Overlay if not selected -->
                    @if (selectedImageIndex() !== $index) {
                      <div class="absolute inset-0 bg-pitch-black/40 group-hover:bg-pitch-black/0 transition-colors"></div>
                    }
                  </button>
                }
              </div>
            }
          </div>

          <!-- Informacion Vehiculo -->
          <div class="space-y-10">
            <div class="space-y-2">
              @if (vehicle()?.marca) {
                <h2 class="text-action-primary font-black uppercase tracking-widest text-sm flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-action-primary"></div>
                  {{ vehicle()?.marca?.nombre | formatEnum }}
                </h2>
              }
              <h1 class="text-5xl font-black text-vehicle-teal tracking-tight">{{ vehicle()?.modelo }}</h1>
              <p class="text-4xl font-black text-action-primary pt-4">{{ vehicle()?.precio | currency:'EUR' }}</p>
            </div>

            <div class="grid grid-cols-2 gap-6 bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-action-primary/20 shadow-xl relative overflow-hidden">
              <div class="absolute top-0 right-0 w-32 h-32 bg-action-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
              
              @if (vehicle()?.kilometraje !== undefined) {
                <div class="space-y-1 relative z-10">
                  <span class="text-content-muted text-[10px] font-black uppercase tracking-widest opacity-60">Kilometraje</span>
                  <p class="text-vehicle-teal font-bold text-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-route-icon lucide-route text-vehicle-teal"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>
                    {{ vehicle()?.kilometraje }} Km
                  </p>
                </div>
              }
              @if (vehicle()?.potencia !== undefined) {
                <div class="space-y-1 relative z-10">
                  <span class="text-content-muted text-[10px] font-black uppercase tracking-widest opacity-60">Potencia</span>
                  <p class="text-vehicle-teal font-bold text-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-biceps-flexed-icon lucide-biceps-flexed text-vehicle-teal"><path d="M12.409 13.017A5 5 0 0 1 22 15c0 3.866-4 7-9 7-4.077 0-8.153-.82-10.371-2.462-.426-.316-.631-.832-.62-1.362C2.118 12.723 2.627 2 10 2a3 3 0 0 1 3 3 2 2 0 0 1-2 2c-1.105 0-1.64-.444-2-1"/><path d="M15 14a5 5 0 0 0-7.584 2"/><path d="M9.964 6.825C8.019 7.977 9.5 13 8 15"/></svg>
                    {{ vehicle()?.potencia }} CV
                  </p>
                </div>
              }
              <!-- Row 2 -->
              @if (vehicle()?.tipoVehiculo) {
                <div class="space-y-1 relative z-10">
                  <span class="text-content-muted text-[10px] font-black uppercase tracking-widest opacity-60">Tipo</span>
                  <p class="text-vehicle-teal font-bold text-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-car-icon lucide-car text-vehicle-teal"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                    {{ vehicle()?.tipoVehiculo | formatEnum }}
                  </p>
                </div>
              }
              @if (vehicle()?.combustible) {
                <div class="space-y-1 relative z-10">
                  <span class="text-content-muted text-[10px] font-black uppercase tracking-widest opacity-60">Combustible</span>
                  <p class="text-vehicle-teal font-bold text-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-fuel-icon lucide-fuel text-vehicle-teal"><path d="M3 22L15 22"/><path d="M4 9L14 9"/><path d="M14 22L14 11"/><path d="M15 6L14 6L14 11"/><path d="M4 22L4 7C4 5.34315 5.34315 4 7 4H11C12.6569 4 14 5.34315 14 7V22"/><path d="M18 10C18.5523 10 19 9.55228 19 9C19 8.44772 18.5523 8 18 8C17.4477 8 17 8.44772 17 9C17 9.55228 17.4477 10 18 10Z"/><path d="M14 13L16 13C17.1046 13 18 13.8954 18 15V22"/></svg>
                    {{ vehicle()?.combustible | formatEnum }}
                  </p>
                </div>
              }
              <!-- Row 3 -->
              @if (vehicle()?.anioFabricacion) {
                <div class="space-y-1 relative z-10">
                  <span class="text-content-muted text-[10px] font-black uppercase tracking-widest opacity-60">Año</span>
                  <p class="text-vehicle-teal font-bold text-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-icon lucide-calendar text-vehicle-teal"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
                    {{ vehicle()?.anioFabricacion }}
                  </p>
                </div>
              }
              @if(vehicle()?.plazas){
                <div class="space-y-1 relative z-10">
                  <span class="text-content-muted text-[10px] font-black uppercase tracking-widest opacity-60">Plazas</span>
                  <p class="text-vehicle-teal font-bold text-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-icon lucide-user text-vehicle-teal"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    {{ vehicle()?.plazas }}
                  </p>
                </div>
              }
              @if(vehicle()?.color){
                <div class="space-y-1 relative z-10">
                  <span class="text-content-muted text-[10px] font-black uppercase tracking-widest opacity-60">Color</span>
                  <p class="text-vehicle-teal font-bold text-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-spray-can-icon lucide-spray-can text-vehicle-teal"><path d="M3 3h.01"/><path d="M7 5h.01"/><path d="M11 7h.01"/><path d="M3 7h.01"/><path d="M7 9h.01"/><path d="M3 11h.01"/><rect width="4" height="4" x="15" y="5"/><path d="m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2"/><path d="m13 14 8-2"/><path d="m13 19 8-2"/></svg>
                    {{ vehicle()?.color }}
                  </p>
                </div>
              }
            </div>

            <div class="space-y-4">
              @if (isClient() && vehicle()?.disponible) {
                <div class="space-y-4 bg-action-primary/10 p-6 rounded-2xl border border-action-primary/20 glass-card">
                  <label class="text-[10px] text-action-primary font-black uppercase tracking-widest block mb-2">Tu Oferta Directa (€)</label>
                  <div class="relative">
                    <input type="number" [(ngModel)]="offerPrice" 
                      class="w-full bg-surface-base/20 border-2 border-action-primary/30 rounded-xl py-4 px-4 text-content-primary font-black text-2xl outline-none focus:border-action-primary transition-all shadow-inner"
                      placeholder="Ej: 15000">
                    <span class="absolute right-4 top-1/2 -translate-y-1/2 text-action-primary font-black text-2xl">€</span>
                  </div>
                  <p class="text-[9px] text-content-muted font-bold uppercase tracking-wider italic">Al confirmar, el vendedor recibirá tu oferta y podrá aceptarla o rechazarla.</p>
                </div>

                <button (click)="buy()" [disabled]="buying() || tieneOfertaPendiente()"
                  class="btn-primary w-full text-surface-base font-black py-5 rounded-2xl transition-all shadow-2xl shadow-action-primary/30 active:scale-[0.98] flex items-center justify-center gap-3 group/buy disabled:opacity-50 disabled:cursor-not-allowed">
                  @if (buying()) {
                    <div class="w-6 h-6 border-3 border-surface-base/20 border-t-surface-base rounded-full animate-spin"></div>
                  } @else {
                    {{ tieneOfertaPendiente() ? 'Petición de compra enviada' : 'Confirmar Propuesta de Compra' }}
                    @if (!tieneOfertaPendiente()) {
                      <svg class="group-hover/buy:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    }
                  }
                </button>
                @if (tieneOfertaPendiente()) {
                  <p class="text-center text-action-primary font-bold text-xs animate-pulse">Ya has enviado una petición para este vehículo. Espera a que el vendedor responda.</p>
                }
              }
              @if (vehicle()?.disponible && (canContact() || !authService.isAuthenticated())) {
                <button (click)="openContactModal()" class="btn-primary w-full text-surface-base font-black py-5 rounded-2xl transition-all shadow-2xl shadow-action-primary/30 active:scale-[0.98] flex items-center justify-center gap-3 group/buy">
                  Contactar con el Vendedor
                  <svg class="group-hover/buy:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3 3.8z"/></svg>
                </button>
              } @else if (!vehicle()?.disponible) {
                <div class="w-full bg-white/5 border border-white/10 text-content-muted font-black py-5 rounded-2xl text-center uppercase tracking-widest text-sm italic">
                  Vehículo No Disponible para Solicitudes
                </div>
              }
            </div>
          </div>
        </div>
      }
    
      @if (!vehicle() && !loading()) {
        <div class="text-center py-40">
          <p class="text-content-muted">No se ha podido cargar la información del vehículo.</p>
        </div>
      }
    </div>

    <!-- Lightbox Modal -->
    @if (isLightboxOpen()) {
      <div 
        class="fixed inset-0 z-[100] bg-surface-base/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in"
        (click)="closeLightbox()">
        
        <!-- Controls -->
        <button (click)="closeLightbox()" class="absolute top-8 right-8 text-content-primary hover:text-action-primary transition-colors z-[110] p-2 bg-white/5 rounded-full border border-white/10 group">
          <svg class="group-hover:rotate-90 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        @if (vehicle()?.imagenes && vehicle()!.imagenes!.length > 1) {
          <button (click)="prevImage($event)" class="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 text-content-primary hover:text-action-primary transition-all z-[110] p-4 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 active:scale-90">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button (click)="nextImage($event)" class="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 text-content-primary hover:text-action-primary transition-all z-[110] p-4 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 active:scale-90">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        }

        <!-- Main Lightbox Image -->
        <div class="max-w-5xl w-full max-h-[85vh] flex flex-col items-center gap-6" (click)="$event.stopPropagation()">
          <img 
            [ngSrc]="vehicle()!.imagenes![selectedImageIndex()].url" 
            fill
            class="object-contain rounded-3xl shadow-2xl pointer-events-none select-none animate-zoom-in"
            alt="Vehículo Ampliado">
          
          <!-- Counter -->
          <div class="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-content-primary font-black text-sm tracking-widest">
            {{ selectedImageIndex() + 1 }} / {{ vehicle()?.imagenes?.length }}
          </div>
        </div>
      </div>
    }

    <!-- Contact Modal -->
    @if (showContactModal()) {
      <div 
        class="fixed inset-0 z-[100] bg-surface-base/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
        (click)="closeContactModal()">
        
        <div 
          class="bg-surface-card/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 lg:p-12 max-w-lg w-full shadow-2xl relative overflow-hidden animate-zoom-in"
          (click)="$event.stopPropagation()">
          
          <!-- Background Glow -->
          <div class="absolute top-0 right-0 w-64 h-64 bg-action-primary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>

          <button (click)="closeContactModal()" class="absolute top-6 right-6 text-content-primary/40 hover:text-content-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          <div class="relative z-10 space-y-8">
            <div class="space-y-2 text-center">
              <h3 class="text-3xl font-black text-content-primary tracking-tight">Contactar con el Vendedor</h3>
              <p class="text-action-primary font-medium whitespace-nowrap overflow-hidden text-ellipsis">Envía un mensaje sobre este {{ vehicle()?.modelo }}</p>
            </div>

            <div class="space-y-4">
              <div class="space-y-2">
                <label class="text-[10px] text-action-primary font-black uppercase tracking-widest px-1">Tu Mensaje</label>
                <textarea 
                  [(ngModel)]="contactMessage"
                  rows="5"
                  class="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-content-primary placeholder:text-content-primary/20 outline-none focus:border-action-primary transition-all resize-none shadow-inner"
                  placeholder="Escribe aquí tu consulta o interés por el vehículo..."></textarea>
              </div>
            </div>

            <button 
              (click)="sendContactMessage()"
              [disabled]="isSendingContact() || !contactMessage().trim()"
              class="btn-primary w-full text-surface-base font-black py-5 rounded-2xl transition-all shadow-2xl shadow-action-primary/30 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
              @if (isSendingContact()) {
                <div class="w-6 h-6 border-3 border-surface-base/20 border-t-surface-base rounded-full animate-spin"></div>
              } @else {
                Enviar Mensaje
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polyline points="22 2 15 22 11 13 2 9 22 2"/></svg>
              }
            </button>
          </div>
        </div>
      </div>
    }
    `,
    styles: [`
    .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
    .animate-zoom-in { animation: zoomIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
    @keyframes zoomIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
    .glass-card { background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%); }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class VehicleDetailsComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private vehicleService = inject(VehicleService);
    public authService = inject(AuthService);
    private ventaService = inject(VentaService);
    private contactoService = inject(ContactoService);
    private ns = inject(NotificationService);

    vehicle = signal<Vehicle | null>(null);
    loading = signal(true);
    buying = signal(false);
    offerPrice = model(0);
    selectedImageIndex = signal(0);
    isLightboxOpen = signal(false);
    showContactModal = signal(false);
    contactMessage = model('');
    isSendingContact = signal(false);
    tieneOfertaPendiente = signal(false);

    canContact = computed(() => {
        const user = this.authService.currentUser$();
        return user?.rol === Rol.ADMINISTRADOR || user?.rol === Rol.VENDEDOR;
    });

    isClient = computed(() => {
        const user = this.authService.currentUser$();
        return user?.rol === Rol.CLIENTE;
    });

    constructor() {
        const navigation = this.router.currentNavigation();
        if (navigation?.extras.state?.['vehicle']) {
            const v = navigation.extras.state['vehicle'];
            this.vehicle.set(v);
            this.offerPrice.set(v.precio);
            this.loading.set(false);
        }
    }

    ngOnInit() {
        if (!this.vehicle()) {
            const id = Number(this.route.snapshot.paramMap.get('id'));
            this.vehicleService.getVehiculoById(id).subscribe({
                next: (vehicle) => {
                    if (vehicle) {
                        this.vehicle.set(vehicle);
                        this.offerPrice.set(vehicle.precio);
                        this.checkPendingOffer(vehicle.idVehiculo);
                    }
                    this.loading.set(false);
                },
                error: () => this.loading.set(false)
            });
        } else {
            this.checkPendingOffer(this.vehicle()!.idVehiculo);
        }
    }

    checkPendingOffer(idVehiculo: number) {
        const user = this.authService.currentUser$();
        if (user && user.rol === Rol.CLIENTE) {
            this.ventaService.tieneOfertaPendiente(user.id, idVehiculo).subscribe({
                next: (res) => this.tieneOfertaPendiente.set(res),
                error: (err) => console.error('Error al comprobar oferta pendiente:', err)
            });
        }
    }

    // GALLERY LOGIC
    openLightbox() {
        this.isLightboxOpen.set(true);
        document.body.style.overflow = 'hidden'; // Lock scroll
    }

    closeLightbox() {
        this.isLightboxOpen.set(false);
        document.body.style.overflow = 'auto'; // Unlock scroll
    }

    nextImage(event?: MouseEvent) {
        if (event) event.stopPropagation();
        const images = this.vehicle()?.imagenes;
        if (!images) return;
        this.selectedImageIndex.set((this.selectedImageIndex() + 1) % images.length);
    }

    prevImage(event?: MouseEvent) {
        if (event) event.stopPropagation();
        const images = this.vehicle()?.imagenes;
        if (!images) return;
        this.selectedImageIndex.set((this.selectedImageIndex() - 1 + images.length) % images.length);
    }

    @HostListener('window:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (!this.isLightboxOpen()) return;

        if (event.key === 'ArrowRight') {
            this.nextImage();
        } else if (event.key === 'ArrowLeft') {
            this.prevImage();
        } else if (event.key === 'Escape') {
            this.closeLightbox();
        }
    }

    buy() {
        const v = this.vehicle();
        const user = this.authService.currentUser$();
        if (!v || !user) return;

        this.buying.set(true);
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];

        this.ventaService.createVenta({
            vehiculo: { idVehiculo: v.idVehiculo },
            cliente: { id: user.id },
            vendedor: { id: v.vendedor?.id },
            precio: this.offerPrice(),
            fecha: formattedDate
        }).subscribe({
            next: () => {
                this.ns.success('Solicitud de compra enviada con éxito');
                this.router.navigate(['/cliente/compras']);
            },
            error: (err: any) => {
                console.error('Error en compra:', err);
                this.ns.error('Error al procesar la solicitud de compra');
                this.buying.set(false);
            }
        });
    }

    // CONTACT LOGIC
    openContactModal() {
        if (!this.authService.isAuthenticated()) {
            this.ns.info('Debes iniciar sesión para contactar con el vendedor');
            this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
            return;
        }

        if (!this.canContact()) {
            this.ns.error('Solo los vendedores o administradores pueden contactar directamente. Como cliente, puedes realizar una oferta.');
            return;
        }

        this.showContactModal.set(true);
        document.body.style.overflow = 'hidden';
    }

    closeContactModal() {
        this.showContactModal.set(false);
        this.contactMessage.set('');
        if (!this.isLightboxOpen()) {
            document.body.style.overflow = 'auto';
        }
    }

    sendContactMessage() {
        const v = this.vehicle();
        const msg = this.contactMessage().trim();
        
        if (!v || !msg) return;

        this.isSendingContact.set(true);
        this.contactoService.enviarMensajeVehiculo(v.idVehiculo, msg).subscribe({
            next: () => {
                this.ns.success('Mensaje enviado al vendedor correctamente');
                this.closeContactModal();
                this.isSendingContact.set(false);
            },
            error: (err) => {
                console.error('Error al enviar mensaje:', err);
                this.ns.error('No se pudo enviar el mensaje. Inténtalo de nuevo.');
                this.isSendingContact.set(false);
            }
        });
    }
}
