import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    private readonly apiUrl = 'http://localhost:8082/api/contacto';

    enviarMensaje(contacto: ContactoDTO): Observable<void> {
        return this.http.post<void>(this.apiUrl, contacto);
    }
}
