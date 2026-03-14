import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';


@Component({
    selector: 'app-client-dashboard',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
    template: `
    <div class="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
      <!-- Sidebar Navigation -->
      <aside class="space-y-2">
        <a routerLink="/cliente" [routerLinkActiveOptions]="{exact: true}" routerLinkActive="bg-baltic-blue-500 text-white shadow-lg shadow-baltic-blue-600/20"
           class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-dark-teal-600 hover:text-baltic-blue-600 hover:bg-white/40 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Mi Perfil
        </a>
        <a routerLink="/cliente/compras" routerLinkActive="bg-baltic-blue-500 text-white shadow-lg shadow-baltic-blue-600/20"
           class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-dark-teal-600 hover:text-baltic-blue-600 hover:bg-white/40 transition-all">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          Mis Compras
        </a>
      </aside>

      <!-- Main Content Area -->
      <section class="min-h-[500px]">
        <router-outlet></router-outlet>
      </section>
    </div>
  `
})
export class ClientDashboardComponent { }
