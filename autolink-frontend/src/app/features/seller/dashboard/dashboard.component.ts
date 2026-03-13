import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';


@Component({
    selector: 'app-seller-dashboard',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
    template: `
    <div class="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
      <aside class="space-y-2">
        <a routerLink="/vendedor" [routerLinkActiveOptions]="{exact: true}" routerLinkActive="bg-blue-600 text-white shadow-lg shadow-blue-600/20"
           class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Mi Stock
        </a>
        <a routerLink="/vendedor/ventas" routerLinkActive="bg-blue-600 text-white shadow-lg shadow-blue-600/20"
           class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          Mis Ventas
        </a>
      </aside>

      <section class="min-h-[500px]">
        <router-outlet></router-outlet>
      </section>
    </div>
  `
})
export class SellerDashboardComponent { }
