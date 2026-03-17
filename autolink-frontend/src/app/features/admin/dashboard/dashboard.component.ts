import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';


@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
    template: `
    <div class="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
      <aside class="space-y-2">
        <a routerLink="/admin" [routerLinkActiveOptions]="{exact: true}" routerLinkActive="bg-baltic-blue-500 text-white shadow-lg shadow-baltic-blue-600/20"
           class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-dark-teal-600 hover:text-baltic-blue-600 hover:bg-white/40 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Usuarios
        </a>
        <a routerLink="/admin/verificaciones" routerLinkActive="bg-baltic-blue-500 text-white shadow-lg shadow-baltic-blue-600/20"
           class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-dark-teal-600 hover:text-baltic-blue-600 hover:bg-white/40 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
          Verificaciones
        </a>
        <a routerLink="/admin/auditoria" routerLinkActive="bg-baltic-blue-500 text-white shadow-lg shadow-baltic-blue-600/20"
           class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-dark-teal-600 hover:text-baltic-blue-600 hover:bg-white/40 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
          Auditoría Ventas
        </a>
        <a routerLink="/admin/perfil" routerLinkActive="bg-baltic-blue-500 text-white shadow-lg shadow-baltic-blue-600/20"
           class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-dark-teal-600 hover:text-baltic-blue-600 hover:bg-white/40 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Mi Perfil
        </a>
      </aside>

      <section class="min-h-[500px]">
        <router-outlet></router-outlet>
      </section>
    </div>
  `
})
export class AdminDashboardComponent { }
