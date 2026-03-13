import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';


@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    template: `
    <nav class="bg-slate-900 border-b border-slate-800 text-white shadow-lg sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center gap-2">
            <a routerLink="/" class="flex items-center gap-2 group">
              <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-blue-500/20 shadow-lg">
                <span class="text-xl font-bold">AL</span>
              </div>
              <span class="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                AutoLink
              </span>
            </a>
          </div>
    
          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-6">
            <a routerLink="/" routerLinkActive="text-blue-500" [routerLinkActiveOptions]="{exact: true}" class="hover:text-blue-400 transition-colors font-medium">Catálogo</a>
    
            @if (authService.isAuthenticated()) {
              @if (isCliente()) {
                <a routerLink="/cliente" routerLinkActive="text-blue-500" class="hover:text-blue-400 transition-colors font-medium">Mis Compras</a>
              }
              @if (isVendedor()) {
                <a routerLink="/vendedor" routerLinkActive="text-blue-500" class="hover:text-blue-400 transition-colors font-medium">Mi Stock</a>
              }
              @if (isAdmin()) {
                <a routerLink="/admin" routerLinkActive="text-blue-500" class="hover:text-blue-400 transition-colors font-medium">Panel Admin</a>
              }
              <div class="h-6 w-px bg-slate-700"></div>
              <div class="flex items-center gap-3">
                <div class="flex flex-col items-end">
                  <span class="text-sm font-semibold">{{ authService.currentUser$()?.nombre }}</span>
                  <span class="text-[10px] uppercase tracking-wider text-slate-400">{{ authService.currentUser$()?.rol }}</span>
                </div>
                <button (click)="authService.logout()" class="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-red-400 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </button>
              </div>
            }
    
            @if (!authService.isAuthenticated()) {
              <a routerLink="/login" class="hover:text-blue-400 transition-colors font-medium">Login</a>
              <a routerLink="/registrar" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95">Registrarse</a>
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
