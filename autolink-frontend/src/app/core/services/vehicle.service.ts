import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle, Marca } from '../models/vehicle.model';
import { PaginatedResponse } from '../models/pagination.model';

@Injectable({
    providedIn: 'root'
})
export class VehicleService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:8082';

    getVehiculosDisponibles(page: number = 0, size: number = 10): Observable<PaginatedResponse<Vehicle>> {
        const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
        return this.http.get<PaginatedResponse<Vehicle>>(`${this.apiUrl}/vehiculos/buscar-disponible`, { params });
    }

    getMarcas(): Observable<Marca[]> {
        return this.http.get<Marca[]>(`${this.apiUrl}/marcas`);
    }

    buscarVehiculos(filtros: any, page: number = 0, size: number = 10): Observable<PaginatedResponse<Vehicle>> {
        let params = this.buildParams(filtros);
        params = params.set('page', page.toString()).set('size', size.toString());
        return this.http.get<PaginatedResponse<Vehicle>>(`${this.apiUrl}/vehiculos/buscar`, { params });
    }

    private buildParams(filtros: any): HttpParams {
        let params = new HttpParams();
        const mapping: { [key: string]: string } = {
            marca: 'marca',
            modelo: 'modelo',
            tipo: 'tipo',
            combustible: 'combustible',
            color: 'color',
            minPotencia: 'minPotencia',
            maxPrecio: 'maxPrecio',
            maxKm: 'maxKm',
            plazas: 'plazas',
            disponible: 'disponible',
            verificado: 'verificado',
            filterDisp: 'filterDisp',
            filterVerif: 'filterVerif',
            anioFabricacion: 'anioFabricacion'
        };

        Object.keys(filtros).forEach(key => {
            const val = filtros[key as keyof typeof filtros];
            if (val !== null && val !== undefined && val !== '') {
                const paramName = mapping[key] || key;
                params = params.set(paramName, val.toString());
                if (paramName === 'disponible') params = params.set('filterDisp', 'true');
                if (paramName === 'verificado') params = params.set('filterVerif', 'true');
            }
        });
        return params;
    }

    getVehiculosPorVendedor(idVendedor: number, page: number = 0, size: number = 10): Observable<PaginatedResponse<Vehicle>> {
        const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
        return this.http.get<PaginatedResponse<Vehicle>>(`${this.apiUrl}/vehiculos/vendedor/${idVendedor}`, { params });
    }

    getVehiculoById(id: number): Observable<Vehicle | undefined> {
        // Fallback since backend doesn't have GET /vehiculos/{id} yet
        // Usamos buscarVehiculos con una página grande para encontrarlo sin el error de ordenación del backend
        return new Observable(observer => {
            this.buscarVehiculos({}, 0, 100).subscribe({
                next: (response) => {
                    const found = response.content.find(v => v.idVehiculo === id);
                    observer.next(found);
                    observer.complete();
                },
                error: (err) => observer.error(err)
            });
        });
    }

    createVehiculo(vehiculo: Partial<Vehicle>): Observable<Vehicle> {
        return this.http.post<Vehicle>(`${this.apiUrl}/vehiculos`, vehiculo);
    }

    updateVehiculo(id: number, vehiculo: Partial<Vehicle>): Observable<Vehicle> {
        return this.http.put<Vehicle>(`${this.apiUrl}/vehiculos/${id}`, vehiculo);
    }

    updateDisponible(id: number, disponible: boolean): Observable<any> {
        return this.http.put(`${this.apiUrl}/vehiculos/${id}/disponible`, disponible);
    }

    verificarVehiculo(id: number, verificado: boolean): Observable<any> {
        return this.http.put(`${this.apiUrl}/vehiculos/${id}/verificado`, verificado);
    }

    deleteVehiculo(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/vehiculos/${id}`);
    }
}
