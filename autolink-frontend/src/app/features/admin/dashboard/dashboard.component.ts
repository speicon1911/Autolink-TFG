import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
    template: `
    <div class="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
      <aside class="space-y-1">
        <a routerLink="/admin" [routerLinkActiveOptions]="{exact: true}" routerLinkActive="bg-action-primary !text-surface-base shadow-lg shadow-action-primary/20"
           class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-content-secondary hover:text-action-primary hover:bg-surface-card transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Usuarios
        </a>
        <a routerLink="/admin/verificaciones" routerLinkActive="bg-action-primary !text-surface-base shadow-lg shadow-action-primary/20"
           class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-content-secondary hover:text-action-primary hover:bg-surface-card transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
          Verificaciones
        </a>
        <a routerLink="/admin/auditoria" routerLinkActive="bg-action-primary !text-surface-base shadow-lg shadow-action-primary/20"
           class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-content-secondary hover:text-action-primary hover:bg-surface-card transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
          Auditoría Ventas
        </a>
        <a routerLink="/admin/marcas" routerLinkActive="bg-action-primary !text-surface-base shadow-lg shadow-action-primary/20"
           class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-content-secondary hover:text-action-primary hover:bg-surface-card transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2 3.5 2.5a2 2 0 0 0 2.5 0l3.5-2.5-1 4.5a2 2 0 0 0 .5 2l3 3.5-4.5.5a2 2 0 0 0-1.5 1.5l-2.5 4-2.5-4a2 2 0 0 0-1.5-1.5l-4.5-.5 3-3.5a2 2 0 0 0 .5-2l-1-4.5Z"/><path d="M12 22v-5"/><path d="M9 17l3 5 3-5"/></svg>
          Gestión Marcas
        </a>
        <a routerLink="/admin/perfil" routerLinkActive="bg-action-primary !text-surface-base shadow-lg shadow-action-primary/20"
           class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-content-secondary hover:text-action-primary hover:bg-surface-card transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Mi Perfil
        </a>
        <button (click)="openAuthModal()"
           class="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-content-secondary hover:text-action-primary hover:bg-surface-card transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
          Base de Datos (PMA)
        </button>
      </aside>

      <section class="min-h-[500px]">
        <router-outlet></router-outlet>
      </section>
    </div>

    <!-- Sleek Security Verification Modal -->
    @if (showModal) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 transition-all duration-300">
        <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          
          <h3 class="text-2xl font-extrabold text-white text-center mb-2 flex items-center justify-center gap-2">
            <svg class="text-action-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Acceso Restringido
          </h3>
          <p class="text-slate-400 text-sm text-center mb-6">
            Introduce la clave de seguridad del Nginx de producción para poder visualizar phpMyAdmin.
          </p>
          
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Clave de Seguridad Nginx</label>
              <input type="password" [(ngModel)]="authKey" (keyup.enter)="verifyKey()" placeholder="••••••••••••"
                     class="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-700 focus:outline-none focus:border-action-primary focus:ring-1 focus:ring-action-primary transition-all">
            </div>
            
            @if (errorMessage) {
              <p class="text-red-500 text-xs font-bold animate-pulse">{{ errorMessage }}</p>
            }
            
            <div class="flex gap-4 pt-2">
              <button (click)="closeAuthModal()"
                      class="flex-1 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all">
                Cancelar
              </button>
              <button (click)="verifyKey()"
                      class="flex-1 px-4 py-3 rounded-xl bg-action-primary text-surface-base font-bold shadow-lg shadow-action-primary/20 hover:shadow-action-primary/40 hover:brightness-110 transition-all">
                Verificar y Entrar
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
    showModal = false;
    authKey = '';
    errorMessage = '';

    ngOnInit() {
        if (typeof window !== 'undefined') {
            // Establece una cookie temporal que autoriza al navegador para acceder a /admin-pma en Nginx
            document.cookie = "auth_admin=true; path=/; SameSite=Strict";
        }
    }

    ngOnDestroy() {
        if (typeof window !== 'undefined') {
            // Elimina la cookie inmediatamente al salir del panel de administración
            document.cookie = "auth_admin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
            document.cookie = "auth_db_key=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
        }
    }

    openAuthModal() {
        this.showModal = true;
        this.authKey = '';
        this.errorMessage = '';
    }

    closeAuthModal() {
        this.showModal = false;
    }

    verifyKey() {
        if (this.authKey.trim() !== '') {
            if (typeof window !== 'undefined') {
                // El frontend ya no tiene la clave harcodeada. 
                // Simplemente guarda lo que el usuario escribe y Nginx decidirá si es correcto.
                document.cookie = "auth_admin=true; path=/; SameSite=Strict";
                document.cookie = "auth_db_key=" + encodeURIComponent(this.authKey) + "; path=/; SameSite=Strict";
                
                setTimeout(() => {
                    window.open('/admin-pma/', '_blank');
                }, 200);
            }
            this.showModal = false;
        } else {
            this.errorMessage = 'Por favor, introduce una clave.';
        }
    }
}
