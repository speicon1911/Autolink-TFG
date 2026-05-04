import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ToastComponent } from '../../components/toast/toast.component';
import { ChatWidgetComponent } from '../../components/chat-widget/chat-widget.component';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [RouterOutlet, NavbarComponent, ToastComponent, ChatWidgetComponent],
    template: `
    <div class="min-h-screen bg-surface-base text-content-primary font-sans selection:bg-action-primary/30">
      <app-navbar></app-navbar>
    
      <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <router-outlet></router-outlet>
      </main>
 
      <app-toast></app-toast>
      <app-chat-widget></app-chat-widget>
 
      <footer class="mt-auto py-12 border-t border-white/5 bg-surface-card/50">
        <div class="max-w-7xl mx-auto px-4 text-center">
          <p class="text-content-muted text-sm">© 2026 AutoLink - La plataforma definitiva de compra-venta de vehículos.</p>
        </div>
        
      </footer>
    </div>
  `
})
export class MainLayoutComponent { }
