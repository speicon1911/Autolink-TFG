import { DecimalPipe } from '@angular/common'; // Para el error del pipe number
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router'; // Para que el botón de catálogo funcione

// Definimos cómo es un vehículo para evitar errores de escritura
interface Vehiculo {
  id: number;
  marca: string;
  modelo: string;
  precio: number;
  imagen?: string; // El signo ? significa que es opcional
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DecimalPipe, RouterLink], // Añadimos lo necesario aquí
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  // Simulamos los datos que vendrían de la base de datos
  vehiculos: Vehiculo[] = [
    { 
      id: 1, 
      marca: 'Audi', 
      modelo: 'A3 Sedan', 
      precio: 35000, 
      imagen: 'assets/audi-a3.jpg' 
    },
    { 
      id: 2, 
      marca: 'BMW', 
      modelo: 'Serie 1', 
      precio: 32000, 
      imagen: 'assets/bmw-s1.jpg' 
    },
    { 
      id: 3, 
      marca: 'Mercedes', 
      modelo: 'Clase A', 
      precio: 38500, 
      imagen: 'assets/mercedes-a.jpg' 
    },
    { 
      id: 4, 
      marca: 'Tesla', 
      modelo: 'Model 3', 
      precio: 45000, 
      imagen: 'assets/tesla-m3.jpg' 
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Como no hay backend, no llamamos al servicio todavía.
    // Los datos ya están cargados en la variable de arriba.
    console.log('Cargando datos de prueba...');
  }
}