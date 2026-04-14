import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ContactoDTO {
    nombre: string;
    email: string;
    asunto: string;
    mensaje: string;
}

@Injectable({
    providedIn: 'root'
})
export class ContactoService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/api/contacto`;

    enviarMensaje(contacto: ContactoDTO): Observable<void> {
        return this.http.post<void>(this.apiUrl, contacto);
    }

    enviarMensajeVehiculo(idVehiculo: number, mensaje: string): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/vehiculo/${idVehiculo}`, { mensaje });
    }
}
