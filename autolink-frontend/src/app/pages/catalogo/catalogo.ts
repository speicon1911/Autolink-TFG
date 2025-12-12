import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Vehiculo {
  id: number;
  marca: string;
  modelo: string;
  precio: number;
  imagen?: string;
}

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo {
  vehiculos: Vehiculo[] = [
    { id: 1, marca: 'Audi', modelo: 'A3 Sedan', precio: 35000, imagen: 'assets/audi-a3.jpg' },
    { id: 2, marca: 'BMW', modelo: 'Serie 1', precio: 32000, imagen: 'assets/bmw-s1.jpg' },
    { id: 3, marca: 'Mercedes', modelo: 'Clase A', precio: 38500, imagen: 'assets/mercedes-a.jpg' },
    { id: 4, marca: 'Tesla', modelo: 'Model 3', precio: 45000, imagen: 'assets/tesla-m3.jpg' },
    { id: 5, marca: 'Volkswagen', modelo: 'Golf GTI', precio: 42000, imagen: 'assets/vw-golf.jpg' },
    { id: 6, marca: 'Toyota', modelo: 'Corolla Hybrid', precio: 28000, imagen: 'assets/toyota-corolla.jpg' },
    { id: 7, marca: 'Hyundai', modelo: 'Tucson', precio: 31500, imagen: 'assets/hyundai-tucson.jpg' },
    { id: 8, marca: 'Ford', modelo: 'Mustang Mach-E', precio: 55000, imagen: 'assets/ford-mustang.jpg' }
  ];
}