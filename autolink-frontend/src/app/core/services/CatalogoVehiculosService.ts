import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CatalogoVehiculosService {

  private apiUrl = 'http://localhost:8080/api/vehiculos'; // la URL se cambiará si quieres

  constructor(private http: HttpClient) {}

  // Obtener todos
  getVehiculos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Obtener por id
  getVehiculo(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
