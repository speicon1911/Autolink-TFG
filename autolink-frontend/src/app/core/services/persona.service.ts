import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, Rol } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PersonaService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/personas`;

    listPersonas(activo?: boolean): Observable<User[]> {
        let url = this.apiUrl;
        if (activo !== undefined) {
            url += `?activo=${activo}`;
        }
        return this.http.get<User[]>(url);
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

    // paginados

    getPersonasPaginadas(page: number, size: number, rol?: string, activo?: boolean): Observable<any>{
        let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

        if(rol && rol !== 'TODOS'){
            params = params.set('rol', rol);
        }

        if(activo !== undefined) {
            params = params.set('activo', activo.toString());
        }

        return this.http.get<any>(`${this.apiUrl}/paged`, {params});

    }

    actualizarFotoPerfil(id: number, archivo: File): Observable<User> {
        const formData = new FormData();
        formData.append('archivo', archivo);
        return this.http.post<User>(`${this.apiUrl}/${id}/foto`, formData);
    }
}
