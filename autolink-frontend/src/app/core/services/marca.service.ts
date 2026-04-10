import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Marca } from '../models/vehicle.model';
import { PaginatedResponse } from '../models/pagination.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MarcaService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/marcas`;

    getAll(page: number = 0, size: number = 10, sort: string = 'nombre,asc'): Observable<PaginatedResponse<Marca>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
            .set('sort', sort);
        return this.http.get<PaginatedResponse<Marca>>(this.apiUrl, { params });
    }

    create(marca: Partial<Marca>): Observable<Marca> {
        return this.http.post<Marca>(this.apiUrl, marca);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
