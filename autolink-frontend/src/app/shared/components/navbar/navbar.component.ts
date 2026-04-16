import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NgOptimizedImage } from '@angular/common';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgOptimizedImage],
  styles: [`
    @media (max-width: 1023px) {
      .desktop-only {
        display: none !important;
      }
      .mobile-only {
        display: flex !important;
      }
    }
    @media (min-width: 1024px) {
      .desktop-only {
        display: flex !important;
      }
      .mobile-only {
        display: none !important;
      }
    }
  `],
  template: `
    <nav class="bg-dark-teal-950/80 backdrop-blur-md border-b border-white/5 text-pitch-black-50 shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center gap-2">
            <a routerLink="/" class="flex items-center gap-2 group">
              <div class="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-110">
                <img ngSrc="logo.png" width="47" height="40" alt="AutoLink Logo" priority class="object-contain">
              </div>
              <span class="text-2xl font-black tracking-tighter text-pitch-black-50">
                AutoLink
              </span>
            </a>
          </div>
          
          <div class="desktop-only gap-6 text-baltic-blue-300/60 text-sm font-bold uppercase tracking-widest">
            <a routerLink="/privacidad" routerLinkActive="text-baltic-blue-400" class="hover:text-baltic-blue-400 transition-colors">Privacidad</a>
            <a routerLink="/terminos" routerLinkActive="text-baltic-blue-400" class="hover:text-baltic-blue-400 transition-colors">Términos</a>
            <a routerLink="/contacto" routerLinkActive="text-baltic-blue-400" class="hover:text-baltic-blue-400 transition-colors">Contacto</a>
          </div>
    
          <!-- Desktop Navigation -->
          <div class="desktop-only items-center gap-6">
            <a routerLink="/" routerLinkActive="text-baltic-blue-600" [routerLinkActiveOptions]="{exact: true}" class="hover:text-baltic-blue-500 transition-colors font-medium">Catálogo</a>
    
            @if (authService.isAuthenticated()) {
              @if (isCliente()) {
                <a routerLink="/cliente/compras" routerLinkActive="text-baltic-blue-600" class="hover:text-baltic-blue-500 transition-colors font-medium">Mis Compras</a>
              }
              @if (isVendedor()) {
                <a routerLink="/vendedor" routerLinkActive="text-baltic-blue-600" [routerLinkActiveOptions]="{exact: true}" class="hover:text-baltic-blue-500 transition-colors font-medium">Mi Stock</a>
                <a routerLink="/vendedor/ventas" routerLinkActive="text-baltic-blue-600" class="hover:text-baltic-blue-500 transition-colors font-medium">Mis Ventas</a>
              }
              @if (isAdmin()) {
                <a routerLink="/admin" routerLinkActive="text-baltic-blue-600" class="hover:text-baltic-blue-500 transition-colors font-medium">Panel Admin</a>
              }
              <div class="h-6 w-px bg-white/5"></div>
              <div class="flex items-center gap-1">
                <a [routerLink]="getProfileRoute()" class="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                  <div class="flex flex-col items-end">
                    <span class="text-sm font-semibold text-pitch-black-50 group-hover:text-baltic-blue-500 transition-colors">{{ authService.currentUser$()?.nombre }}</span>
                    <span class="text-[10px] uppercase tracking-wider text-baltic-blue-400">{{ authService.currentUser$()?.rol }}</span>
                  </div>
                  <div class="w-8 h-8 rounded-full bg-baltic-blue-500/10 flex items-center justify-center text-baltic-blue-500 group-hover:ring-2 group-hover:ring-baltic-blue-500 transition-all shadow-sm overflow-hidden">
                    @if (authService.currentUser$()?.fotoPerfil) {
                      <img [ngSrc]="authService.currentUser$()!.fotoPerfil!" width="32" height="32" alt="Profile" class="w-full h-full object-cover">
                    } @else {
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    }
                  </div>
                </a>
                <button (click)="authService.logout()" class="p-2 hover:bg-dark-amaranth-500/10 rounded-full text-dark-amaranth-400 hover:text-dark-amaranth-500 transition-all cursor-pointer" title="Cerrar Sesión">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </button>
              </div>
            }
    
            @if (!authService.isAuthenticated()) {
              <a routerLink="/login" class="hover:text-baltic-blue-500 transition-colors font-medium">Login</a>
              <a routerLink="/registrar" class="bg-baltic-blue-500 hover:bg-dark-amaranth-600 text-white px-5 py-2 rounded-full font-bold transition-all shadow-lg shadow-baltic-blue-600/20 active:scale-95">Registrarse</a>
            }
          </div>

          <!-- Mobile menu button -->
          <div class="mobile-only items-center z-[60]">
            <button (click)="toggleMobileMenu()" class="text-white hover:text-baltic-blue-300 focus:outline-none p-2 rounded-md hover:bg-white/5 transition-colors cursor-pointer relative">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                @if (!isMobileMenuOpen()) {
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                } @else {
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Dropdown -->
      @if (isMobileMenuOpen()) {
        <div class="mobile-only flex-col absolute top-16 left-0 w-full border-t border-white/5 bg-dark-teal-950/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-2 shadow-2xl z-[50]">
          <!-- Legal Links -->
          <div class="py-2 flex flex-col gap-2 border-b border-dark-teal-800 pb-3 mb-2">
            <a routerLink="/privacidad" (click)="closeMobileMenu()" class="text-sm font-bold uppercase tracking-widest text-baltic-blue-300 hover:text-baltic-blue-400 block p-3 rounded-md hover:bg-white/5">Privacidad</a>
            <a routerLink="/terminos" (click)="closeMobileMenu()" class="text-sm font-bold uppercase tracking-widest text-baltic-blue-300 hover:text-baltic-blue-400 block p-3 rounded-md hover:bg-white/5">Términos</a>
            <a routerLink="/contacto" (click)="closeMobileMenu()" class="text-sm font-bold uppercase tracking-widest text-baltic-blue-300 hover:text-baltic-blue-400 block p-3 rounded-md hover:bg-white/5">Contacto</a>
          </div>

          <!-- Nav Links -->
          <a routerLink="/" (click)="closeMobileMenu()" class="block py-3 px-3 font-medium text-pitch-black-50 hover:text-baltic-blue-500 rounded-md hover:bg-white/5 text-lg">Catálogo</a>
          
          @if (authService.isAuthenticated()) {
            @if (isCliente()) {
              <a routerLink="/cliente/compras" (click)="closeMobileMenu()" class="block py-3 px-3 font-medium text-pitch-black-50 hover:text-baltic-blue-500 rounded-md hover:bg-white/5 text-lg">Mis Compras</a>
            }
            @if (isVendedor()) {
              <a routerLink="/vendedor" (click)="closeMobileMenu()" class="block py-3 px-3 font-medium text-pitch-black-50 hover:text-baltic-blue-500 rounded-md hover:bg-white/5 text-lg">Mi Stock</a>
              <a routerLink="/vendedor/ventas" (click)="closeMobileMenu()" class="block py-3 px-3 font-medium text-pitch-black-50 hover:text-baltic-blue-500 rounded-md hover:bg-white/5 text-lg">Mis Ventas</a>
            }
            @if (isAdmin()) {
              <a routerLink="/admin" (click)="closeMobileMenu()" class="block py-3 px-3 font-medium text-pitch-black-50 hover:text-baltic-blue-500 rounded-md hover:bg-white/5 text-lg">Panel Admin</a>
            }
            
            <div class="flex items-center justify-between py-4 mt-2 border-t border-dark-teal-800 pt-4">
              <a [routerLink]="getProfileRoute()" (click)="closeMobileMenu()" class="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors group flex-1">
                <div class="w-10 h-10 rounded-full bg-baltic-blue-500/10 flex items-center justify-center text-baltic-blue-500 group-hover:ring-2 group-hover:ring-baltic-blue-500 transition-all overflow-hidden shadow-sm">
                  @if (authService.currentUser$()?.fotoPerfil) {
                    <img [ngSrc]="authService.currentUser$()!.fotoPerfil!" width="40" height="40" alt="Profile" class="w-full h-full object-cover">
                  } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  }
                </div>
                <div class="flex flex-col">
                  <span class="text-base font-semibold text-pitch-black-50 group-hover:text-baltic-blue-400 transition-colors">{{ authService.currentUser$()?.nombre }}</span>
                  <span class="text-xs uppercase tracking-wider text-baltic-blue-400">{{ authService.currentUser$()?.rol }}</span>
                </div>
              </a>
              <button (click)="authService.logout(); closeMobileMenu()" class="p-3 text-dark-amaranth-400 hover:text-white hover:bg-dark-amaranth-500 rounded-full cursor-pointer transition-all bg-white/5" title="Cerrar Sesión">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </button>
            </div>
          } @else {
            <div class="flex flex-col gap-3 mt-4 px-2 pb-2">
              <a routerLink="/login" (click)="closeMobileMenu()" class="block py-3 text-center font-medium border-2 border-baltic-blue-500 text-baltic-blue-400 rounded-lg hover:bg-baltic-blue-500/10 transition-colors">Iniciar Sesión</a>
              <a routerLink="/registrar" (click)="closeMobileMenu()" class="block py-3 text-center font-bold bg-baltic-blue-500 text-white rounded-lg shadow-lg hover:bg-baltic-blue-600 transition-colors">Crear Cuenta</a>
            </div>
          }
        </div>
      }
    </nav>
  `
})
export class NavbarComponent {
  authService = inject(AuthService);
  isMobileMenuOpen = signal(false);

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }

  isCliente() { return this.authService.currentUser$()?.rol === 'CLIENTE'; }
  isVendedor() { return this.authService.currentUser$()?.rol === 'VENDEDOR'; }
  isAdmin() { return this.authService.currentUser$()?.rol === 'ADMINISTRADOR'; }

  getProfileRoute(): string {
    const role = this.authService.currentUser$()?.rol;
    if (role === 'ADMINISTRADOR') return '/admin/perfil';
    if (role === 'VENDEDOR') return '/vendedor/perfil';
    if (role === 'CLIENTE') return '/cliente';
    return '/';
  }
}
