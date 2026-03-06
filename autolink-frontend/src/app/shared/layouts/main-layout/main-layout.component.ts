import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ToastComponent } from '../../components/toast/toast.component';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [RouterOutlet, NavbarComponent, ToastComponent],
    template: `
    <div class="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30">
      <app-navbar></app-navbar>
      
      <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <router-outlet></router-outlet>
      </main>

      <app-toast></app-toast>

      <footer class="mt-auto py-12 border-t border-slate-900 bg-slate-950/50">
        <div class="max-w-7xl mx-auto px-4 text-center">
          <p class="text-slate-500 text-sm">© 2026 AutoLink - La plataforma definitiva de compra-venta de vehículos.</p>
        </div>
      </footer>
    </div>
  `
})
export class MainLayoutComponent { }
