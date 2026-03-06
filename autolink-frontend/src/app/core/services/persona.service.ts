import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, Rol } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class PersonaService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:8082/personas';

    listPersonas(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }

    getPerfil(id: number): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id}`);
    }

    updatePerfil(id: number, user: Partial<User>): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${id}`, user);
    }

    // Admin only
    updateRol(id: number, rol: Rol): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${id}/tipo-usuario`, { rol });
    }

    listVendedores(): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/vendedor`);
    }

    listClientes(): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/cliente`);
    }

    listAdmins(): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/admin`);
    }

    deletePersona(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
