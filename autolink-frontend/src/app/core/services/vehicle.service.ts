import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Vehicle, Marca, EstadoVerificacion } from '../models/vehicle.model';
import { PaginatedResponse } from '../models/pagination.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class VehicleService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;

    getVehiculosDisponibles(page: number = 0, size: number = 12): Observable<PaginatedResponse<Vehicle>> {
        const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
        return this.http.get<PaginatedResponse<Vehicle>>(`${this.apiUrl}/vehiculos/buscar-disponible`, { params });
    }

    getMarcas(): Observable<Marca[]> {
        const params = new HttpParams()
            .set('size', '1000')
            .set('sort', 'nombre,asc');
        return this.http.get<PaginatedResponse<Marca>>(`${this.apiUrl}/marcas`, { params })
            .pipe(map(res => res.content));
    }

    buscarVehiculos(filtros: any, page: number = 0, size: number = 12): Observable<PaginatedResponse<Vehicle>> {
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
            anioFabricacion: 'anioFabricacion',
            ciudad: 'ciudad',
            etiqueta: 'etiqueta'
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

    getVehiculoById(id: number): Observable<Vehicle> {
        return this.http.get<Vehicle>(`${this.apiUrl}/vehiculos/${id}`);
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

    verificarVehiculo(id: number, verificado: EstadoVerificacion): Observable<any> {
        // Al ser un enum (string) lo enviamos como JSON string con comillas si es necesario
        return this.http.put(`${this.apiUrl}/vehiculos/${id}/verificado`, `"${verificado}"`, {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    deleteVehiculo(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/vehiculos/${id}`);
    }

    uploadImages(idVehiculo: number, archivos: File[]): Observable<Vehicle> {
        const formData = new FormData();
        archivos.forEach(archivo => {
            formData.append('archivos', archivo);
        });
        return this.http.post<Vehicle>(`${this.apiUrl}/vehiculos/${idVehiculo}/fotos`, formData);
    }

    deleteImage(idFoto: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/vehiculos/fotos/${idFoto}`);
    }
}
