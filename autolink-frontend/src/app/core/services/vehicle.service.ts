import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle, Marca } from '../models/vehicle.model';

@Injectable({
    providedIn: 'root'
})
export class VehicleService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:8082';

    getVehiculosDisponibles(): Observable<Vehicle[]> {
        return this.http.get<Vehicle[]>(`${this.apiUrl}/vehiculos/buscar-disponible`);
    }

    getMarcas(): Observable<Marca[]> {
        return this.http.get<Marca[]>(`${this.apiUrl}/marcas`);
    }

    buscarVehiculos(filtros: any): Observable<Vehicle[]> {
        let params = new HttpParams();

        // Map frontend filter keys to backend @RequestParam names
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
            verificado: 'verificado'
        };

        Object.keys(filtros).forEach(key => {
            const val = filtros[key];
            if (val !== null && val !== undefined && val !== '') {
                const paramName = mapping[key] || key;
                params = params.set(paramName, val.toString());

                // If filtering by disponible/verificado, backend also expects filterDisp/filterVerif flags
                if (paramName === 'disponible') params = params.set('filterDisp', 'true');
                if (paramName === 'verificado') params = params.set('filterVerif', 'true');
            }
        });

        return this.http.get<Vehicle[]>(`${this.apiUrl}/vehiculos/buscar`, { params });
    }

    getVehiculosPorVendedor(idVendedor: number): Observable<Vehicle[]> {
        return this.http.get<Vehicle[]>(`${this.apiUrl}/vehiculos/vendedor/${idVendedor}`);
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
