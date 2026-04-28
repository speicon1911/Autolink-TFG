import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sale } from '../models/sale.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class VentaService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/ventas`;

    getPurchasesByCliente(idCliente: number): Observable<Sale[]> {
        return this.http.get<Sale[]>(`${this.apiUrl}/cliente/${idCliente}`);
    }

    getSalesByVendedor(idVendedor: number): Observable<Sale[]> {
        return this.http.get<Sale[]>(`${this.apiUrl}/vendedor/${idVendedor}`);
    }

    getAllVentas(): Observable<Sale[]> {
        return this.http.get<Sale[]>(this.apiUrl);
    }

    getSalesByVehiculo(idVehiculo: number): Observable<Sale[]> {
        return this.http.get<Sale[]>(`${this.apiUrl}/vehiculo/${idVehiculo}`);
    }

    createVenta(venta: Partial<Sale>): Observable<Sale> {
        return this.http.post<Sale>(this.apiUrl, venta);
    }

    updatePrecioVenta(idVenta: number, precio: number, rolUltimoModificador: string): Observable<Sale> {
        return this.http.put<Sale>(`${this.apiUrl}/${idVenta}/actualizar-precio`, { idVenta, precio, rolUltimoModificador });
    }

    anularVenta(id: number): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}/anular`, {});
    }

    completarVenta(id: number): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}/completar`, {});
    }

    deleteVenta(idVenta: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${idVenta}`);
    }

    tieneOfertaPendiente(idCliente: number, idVehiculo: number): Observable<boolean> {
        return this.http.get<boolean>(`${this.apiUrl}/pendiente/cliente/${idCliente}/vehiculo/${idVehiculo}`);
    }
}
