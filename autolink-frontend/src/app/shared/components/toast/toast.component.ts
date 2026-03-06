import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="fixed top-20 right-5 z-[60] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <div *ngFor="let n of notificationService.notifications$()" 
           class="pointer-events-auto p-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-slide-in"
           [ngClass]="{
             'bg-emerald-950/90 border-emerald-500/50 text-emerald-100': n.type === 'success',
             'bg-rose-950/90 border-rose-500/50 text-rose-100': n.type === 'error',
             'bg-amber-950/90 border-amber-500/50 text-amber-100': n.type === 'warning',
             'bg-blue-950/90 border-blue-500/50 text-blue-100': n.type === 'info'
           }">
        <div class="flex-shrink-0">
          <svg *ngIf="n.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <svg *ngIf="n.type === 'error'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          <svg *ngIf="n.type === 'warning'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <svg *ngIf="n.type === 'info'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        </div>
        <p class="text-sm font-medium">{{ n.message }}</p>
      </div>
    </div>
  `,
    styles: [`
    .animate-slide-in {
      animation: slideIn 0.3s ease-out forwards;
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
    notificationService = inject(NotificationService);
}
