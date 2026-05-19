import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService, AccessibilityTheme } from '../../../core/services/theme.service';
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
    <nav class="bg-surface-base/95 backdrop-blur-md border-b border-white/5 text-content-primary shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center gap-2">
            <a routerLink="/" class="flex items-center gap-2 group">
              <div class="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-110">
                <img ngSrc="logo.png" width="47" height="40" alt="AutoLink Logo" priority class="object-contain">
              </div>
              <span class="text-2xl font-black tracking-tighter text-content-primary">
                AutoLink
              </span>
            </a>
          </div>
          
          <div class="desktop-only gap-6 text-content-secondary text-sm font-bold uppercase tracking-widest">
            <a routerLink="/privacidad" routerLinkActive="text-action-primary" class="hover:text-action-primary transition-colors">Privacidad</a>
            <a routerLink="/terminos" routerLinkActive="text-action-primary" class="hover:text-action-primary transition-colors">Términos</a>
            <a routerLink="/contacto" routerLinkActive="text-action-primary" class="hover:text-action-primary transition-colors">Contacto</a>
          </div>
    
          <!-- Desktop Navigation -->
          <div class="desktop-only items-center gap-6">
            <a routerLink="/" routerLinkActive="text-action-primary" [routerLinkActiveOptions]="{exact: true}" class="hover:text-action-hover transition-colors font-medium">Catálogo</a>
    
            @if (authService.isAuthenticated()) {
              @if (isCliente()) {
                <a routerLink="/cliente/compras" routerLinkActive="text-action-primary" class="hover:text-action-hover transition-colors font-medium">Mis Compras</a>
              }
              @if (isVendedor()) {
                <a routerLink="/vendedor" routerLinkActive="text-action-primary" [routerLinkActiveOptions]="{exact: true}" class="hover:text-action-hover transition-colors font-medium">Mi Stock</a>
                <a routerLink="/vendedor/ventas" routerLinkActive="text-action-primary" class="hover:text-action-hover transition-colors font-medium">Mis Ventas</a>
              }
              @if (isAdmin()) {
                <a routerLink="/admin" routerLinkActive="text-action-primary" class="hover:text-action-hover transition-colors font-medium">Panel Admin</a>
              }
            }

            <div class="h-6 w-px bg-white/5"></div>

            <!-- Theme & Accessibility (Always Visible) -->
            <div class="flex items-center gap-1">
              <!-- Day/Night Toggle -->
              <button (click)="toggleDayNight()" 
                class="p-2 hover:bg-white/5 rounded-full text-content-secondary hover:text-action-primary transition-all cursor-pointer"
                [title]="themeService.currentTheme() === 'light' ? 'Activar Modo Noche' : 'Activar Modo Día'">
                @if (themeService.currentTheme() === 'light') {
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                }
              </button>

              <!-- Accessibility Selector (Eye) -->
              <div class="relative">
                <button (click)="toggleAccessibilityMenu()" 
                  class="p-2 hover:bg-white/5 rounded-full transition-all cursor-pointer" 
                  [class.text-action-primary]="isDaltonismModeActive()"
                  [class.text-content-secondary]="!isDaltonismModeActive()"
                  title="Modos de Daltonismo">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
                @if (isAccessibilityMenuOpen()) {
                  <div class="absolute right-0 mt-2 w-48 bg-surface-card border border-white/10 rounded-xl shadow-2xl p-2 z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                    <p class="text-[10px] uppercase tracking-widest text-content-muted font-bold px-3 py-2 border-b border-white/5 mb-1">Modos Visuales</p>
                    @for (mode of accessibilityModes; track mode) {
                      <button 
                        (click)="setTheme(mode)"
                        [class.bg-action-primary]="themeService.currentTheme() === mode"
                        [class.text-surface-base]="themeService.currentTheme() === mode"
                        class="w-full text-left px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors flex items-center justify-between"
                      >
                        {{ themeLabels[mode] }}
                        @if (themeService.currentTheme() === mode) {
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        }
                      </button>
                    }
                    @if (isDaltonismModeActive()) {
                      <button (click)="setTheme('normal')" class="w-full mt-1 text-center px-4 py-2 rounded-lg text-[10px] font-bold text-feedback-error hover:bg-feedback-error/10 transition-colors uppercase tracking-widest">
                        Restablecer
                      </button>
                    }
                  </div>
                }
              </div>
            </div>

            <div class="h-6 w-px bg-white/5"></div>

            @if (authService.isAuthenticated()) {
              <div class="flex items-center gap-1">
                <a [routerLink]="getProfileRoute()" class="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                  <div class="flex flex-col items-end">
                    <span class="text-sm font-semibold text-content-primary group-hover:text-action-primary transition-colors">{{ authService.currentUser$()?.nombre }}</span>
                    <span class="text-[10px] uppercase tracking-wider text-action-primary">{{ authService.currentUser$()?.rol }}</span>
                  </div>
                  <div class="w-8 h-8 rounded-full bg-action-primary/10 flex items-center justify-center text-action-primary group-hover:ring-2 group-hover:ring-action-primary transition-all shadow-sm overflow-hidden">
                    @if (authService.currentUser$()?.fotoPerfil) {
                      <img [src]="authService.currentUser$()!.fotoPerfil!" alt="Profile" class="w-full h-full object-cover">
                    } @else {
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    }
                  </div>
                </a>
                <button (click)="authService.logout()" class="p-2 hover:bg-feedback-error/10 rounded-full text-feedback-error transition-all cursor-pointer" title="Cerrar Sesión">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </button>
              </div>
            } @else {
              <div class="flex items-center gap-4">
                <a routerLink="/login" class="hover:text-action-primary transition-colors font-medium">Login</a>
                <a routerLink="/registrar" class="bg-action-primary hover:bg-action-hover text-surface-base px-5 py-2 rounded-full font-bold transition-all shadow-lg shadow-action-primary/20 active:scale-95">Registrarse</a>
              </div>
            }
          </div>

          <!-- Mobile menu button -->
          <div class="mobile-only items-center z-[60]">
            <button (click)="toggleMobileMenu()" 
              aria-label="Abrir menú móvil"
              class="text-content-primary hover:text-action-primary focus:outline-none p-2 rounded-md hover:bg-white/5 transition-colors cursor-pointer relative">
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
        <div class="mobile-only flex-col absolute top-16 left-0 w-full border-t border-white/5 bg-surface-base/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-2 shadow-2xl z-[50]">
          <!-- Accessibility & Theme Selector (Mobile) -->
          <div class="py-4 border-b border-white/5 space-y-4">
            <div class="flex items-center justify-between px-3">
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-action-primary"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                <span class="text-[10px] uppercase tracking-widest text-content-muted font-bold block">Aspecto y Accesibilidad</span>
              </div>
              <button (click)="toggleDayNight()" 
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-content-primary transition-all active:scale-95">
                @if (themeService.currentTheme() === 'light') {
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>
                  <span class="text-[10px] font-bold uppercase">Noche</span>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                  <span class="text-[10px] font-bold uppercase text-action-primary">Día</span>
                }
              </button>
            </div>
            <div class="grid grid-cols-2 gap-2">
              @for (mode of accessibilityModes; track mode) {
                <button 
                  (click)="setTheme(mode); closeMobileMenu()"
                  [class.bg-action-primary]="themeService.currentTheme() === mode"
                  [class.text-surface-base]="themeService.currentTheme() === mode"
                  class="text-xs px-3 py-2 rounded-lg font-bold border border-white/5 hover:bg-white/5 transition-all"
                >
                  {{ themeLabels[mode] }}
                </button>
              }
            </div>
            @if (isDaltonismModeActive()) {
              <button (click)="setTheme('normal'); closeMobileMenu()" class="w-full mt-2 text-center px-4 py-2 rounded-lg text-[10px] font-bold text-feedback-error bg-feedback-error/10 hover:bg-feedback-error/20 transition-colors uppercase tracking-widest border border-feedback-error/20">
                Restablecer Filtros de Daltonismo
              </button>
            }
          </div>

          <!-- Legal Links -->
          <div class="py-2 flex flex-col gap-2 border-b border-white/10 pb-3 mb-2">
            <a routerLink="/privacidad" (click)="closeMobileMenu()" class="text-sm font-bold uppercase tracking-widest text-content-secondary hover:text-action-primary block p-3 rounded-md hover:bg-white/5">Privacidad</a>
            <a routerLink="/terminos" (click)="closeMobileMenu()" class="text-sm font-bold uppercase tracking-widest text-content-secondary hover:text-action-primary block p-3 rounded-md hover:bg-white/5">Términos</a>
            <a routerLink="/contacto" (click)="closeMobileMenu()" class="text-sm font-bold uppercase tracking-widest text-content-secondary hover:text-action-primary block p-3 rounded-md hover:bg-white/5">Contacto</a>
          </div>

          <!-- Nav Links -->
          <a routerLink="/" (click)="closeMobileMenu()" class="block py-3 px-3 font-medium text-content-primary hover:text-action-primary rounded-md hover:bg-white/5 text-lg">Catálogo</a>
          
          @if (authService.isAuthenticated()) {
            @if (isCliente()) {
              <a routerLink="/cliente/compras" (click)="closeMobileMenu()" class="block py-3 px-3 font-medium text-content-primary hover:text-action-primary rounded-md hover:bg-white/5 text-lg">Mis Compras</a>
            }
            @if (isVendedor()) {
              <a routerLink="/vendedor" (click)="closeMobileMenu()" class="block py-3 px-3 font-medium text-content-primary hover:text-action-primary rounded-md hover:bg-white/5 text-lg">Mi Stock</a>
              <a routerLink="/vendedor/ventas" (click)="closeMobileMenu()" class="block py-3 px-3 font-medium text-content-primary hover:text-action-primary rounded-md hover:bg-white/5 text-lg">Mis Ventas</a>
            }
            @if (isAdmin()) {
              <a routerLink="/admin" (click)="closeMobileMenu()" class="block py-3 px-3 font-medium text-content-primary hover:text-action-primary rounded-md hover:bg-white/5 text-lg">Panel Admin</a>
            }
            
            <div class="flex items-center justify-between py-4 mt-2 border-t border-white/10 pt-4">
              <a [routerLink]="getProfileRoute()" (click)="closeMobileMenu()" class="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors group flex-1">
                <div class="w-10 h-10 rounded-full bg-action-primary/10 flex items-center justify-center text-action-primary group-hover:ring-2 group-hover:ring-action-primary transition-all overflow-hidden shadow-sm">
                  @if (authService.currentUser$()?.fotoPerfil) {
                    <img [src]="authService.currentUser$()!.fotoPerfil!" alt="Profile" class="w-full h-full object-cover">
                  } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  }
                </div>
                <div class="flex flex-col">
                  <span class="text-base font-semibold text-content-primary group-hover:text-action-primary transition-colors">{{ authService.currentUser$()?.nombre }}</span>
                  <span class="text-xs uppercase tracking-wider text-action-primary">{{ authService.currentUser$()?.rol }}</span>
                </div>
              </a>
              <button (click)="authService.logout(); closeMobileMenu()" class="p-3 text-feedback-error hover:text-white hover:bg-feedback-error rounded-full cursor-pointer transition-all bg-white/5" title="Cerrar Sesión">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </button>
            </div>
          } @else {
            <div class="flex flex-col gap-3 mt-4 px-2 pb-2">
              <a routerLink="/login" (click)="closeMobileMenu()" class="block py-3 text-center font-medium border-2 border-action-primary text-action-primary rounded-lg hover:bg-action-primary/10 transition-colors">Iniciar Sesión</a>
              <a routerLink="/registrar" (click)="closeMobileMenu()" class="block py-3 text-center font-bold bg-action-primary text-surface-base rounded-lg shadow-lg hover:bg-action-hover transition-colors">Crear Cuenta</a>
            </div>
          }
        </div>
      }
    </nav>
  `
})
export class NavbarComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  
  isMobileMenuOpen = signal(false);
  isAccessibilityMenuOpen = signal(false);

  accessibilityModes: AccessibilityTheme[] = ['protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'];
  themeLabels: Record<AccessibilityTheme, string> = {
    normal: 'Modo Noche',
    light: 'Modo Día',
    protanopia: 'Protanopia',
    deuteranopia: 'Deuteranopia',
    tritanopia: 'Tritanopia',
    achromatopsia: 'Acromatopsia'
  };
 
  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }
 
  toggleAccessibilityMenu() {
    this.isAccessibilityMenuOpen.update(v => !v);
  }
 
  toggleDayNight() {
    const current = this.themeService.currentTheme();
    if (current === 'light') {
      this.themeService.setTheme('normal');
    } else {
      this.themeService.setTheme('light');
    }
  }
 
  isDaltonismModeActive(): boolean {
    const theme = this.themeService.currentTheme();
    return theme !== 'normal' && theme !== 'light';
  }
 
  setTheme(theme: AccessibilityTheme) {
    this.themeService.setTheme(theme);
    this.isAccessibilityMenuOpen.set(false);
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
