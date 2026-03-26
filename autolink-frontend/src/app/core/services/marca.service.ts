import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Marca } from '../models/vehicle.model';

@Injectable({
    providedIn: 'root'
})
export class MarcaService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:8082/marcas';

    getAll(): Observable<Marca[]> {
        return this.http.get<Marca[]>(this.apiUrl);
    }

    create(marca: Partial<Marca>): Observable<Marca> {
        return this.http.post<Marca>(this.apiUrl, marca);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
