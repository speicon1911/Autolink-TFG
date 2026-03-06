import { ErrorHandler, Injectable, inject } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    private readonly notificationService = inject(NotificationService);

    handleError(error: any): void {
        console.error('An error occurred:', error);

        let message = 'Algo ha salido mal. Por favor, inténtalo de nuevo.';

        if (error instanceof HttpErrorResponse) {
            if (typeof error.error === 'string') {
                message = error.error;
            } else if (error.error?.message) {
                message = error.error.message;
            } else if (error.status === 0) {
                message = 'No se puede conectar con el servidor. Revisa tu conexión.';
            }
        } else if (error.message) {
            message = error.message;
        }

        this.notificationService.error(message);
    }
}
