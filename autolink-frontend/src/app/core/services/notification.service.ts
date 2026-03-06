import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
    id: number;
    message: string;
    type: NotificationType;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private notifications = signal<Notification[]>([]);
    public readonly notifications$ = this.notifications.asReadonly();

    show(message: string, type: NotificationType = 'info', duration: number = 3000) {
        const id = Date.now();
        this.notifications.update(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            this.notifications.update(prev => prev.filter(n => n.id !== id));
        }, duration);
    }

    success(message: string) { this.show(message, 'success'); }
    error(message: string) { this.show(message, 'error'); }
    info(message: string) { this.show(message, 'info'); }
    warning(message: string) { this.show(message, 'warning'); }
}
