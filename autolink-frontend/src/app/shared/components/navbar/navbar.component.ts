import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';


@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    template: `
    <nav class="bg-dark-teal-950/80 backdrop-blur-md border-b border-white/5 text-pitch-black-50 shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center gap-2">
            <a routerLink="/" class="flex items-center gap-2 group">
              <div class="w-10 h-10 bg-baltic-blue-500 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-baltic-blue-500/20 shadow-lg">
                <span class="text-xl font-bold text-white">AL</span>
              </div>
              <span class="text-2xl font-black tracking-tighter text-pitch-black-50">
                AutoLink
              </span>
            </a>
          </div>
    
          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-6">
            <a routerLink="/" routerLinkActive="text-baltic-blue-600" [routerLinkActiveOptions]="{exact: true}" class="hover:text-baltic-blue-500 transition-colors font-medium">Catálogo</a>
    
            @if (authService.isAuthenticated()) {
              @if (isCliente()) {
                <a routerLink="/cliente" routerLinkActive="text-baltic-blue-600" class="hover:text-baltic-blue-500 transition-colors font-medium">Mis Compras</a>
              }
              @if (isVendedor()) {
                <a routerLink="/vendedor" routerLinkActive="text-baltic-blue-600" class="hover:text-baltic-blue-500 transition-colors font-medium">Mi Stock</a>
              }
              @if (isAdmin()) {
                <a routerLink="/admin" routerLinkActive="text-baltic-blue-600" class="hover:text-baltic-blue-500 transition-colors font-medium">Panel Admin</a>
              }
              <div class="h-6 w-px bg-white/5"></div>
              <div class="flex items-center gap-3">
                <div class="flex flex-col items-end">
                  <span class="text-sm font-semibold text-pitch-black-50">{{ authService.currentUser$()?.nombre }}</span>
                  <span class="text-[10px] uppercase tracking-wider text-baltic-blue-400">{{ authService.currentUser$()?.rol }}</span>
                </div>
                <button (click)="authService.logout()" class="p-2 hover:bg-white/10 rounded-full text-baltic-blue-300 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </button>
              </div>
            }
    
            @if (!authService.isAuthenticated()) {
              <a routerLink="/login" class="hover:text-baltic-blue-500 transition-colors font-medium">Login</a>
              <a routerLink="/registrar" class="bg-baltic-blue-500 hover:bg-dark-amaranth-600 text-white px-5 py-2 rounded-full font-bold transition-all shadow-lg shadow-baltic-blue-600/20 active:scale-95">Registrarse</a>
            }
          </div>
        </div>
      </div>
    </nav>
    `
})
export class NavbarComponent {
    authService = inject(AuthService);

    isCliente() { return this.authService.currentUser$()?.rol === 'CLIENTE'; }
    isVendedor() { return this.authService.currentUser$()?.rol === 'VENDEDOR'; }
    isAdmin() { return this.authService.currentUser$()?.rol === 'ADMINISTRADOR'; }
}
