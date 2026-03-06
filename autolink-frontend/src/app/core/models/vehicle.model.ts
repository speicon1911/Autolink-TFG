export enum TipoVehiculo {
    SEDAN = 'SEDAN',
    HATCHBACK = 'HATCHBACK',
    COUPE = 'COUPE',
    CONVERTIBLE = 'CONVERTIBLE',
    WAGON = 'WAGON',
    SUV = 'SUV',
    CROSSOVER = 'CROSSOVER',
    MINIVAN = 'MINIVAN',
    VAN = 'VAN',
    PICKUP = 'PICKUP',
    DEPORTIVO = 'DEPORTIVO',
    SUPERCAR = 'SUPERCAR',
    MOTOCICLETA = 'MOTOCICLETA',
    SCOOTER = 'SCOOTER'
}

export interface Marca {
    idMarca: number;
    nombre: string;
}

export interface Vehicle {
    idVehiculo: number;
    precio: number;
    plazas: number;
    potencia: number;
    puertas: number;
    kilometraje: number;
    color: string;
    tipoVehiculo?: TipoVehiculo;
    marca?: Marca;
    modelo?: string;
    fechaFabricacion: string;
    disponible: boolean;
    verificado: boolean;
    fechaVerificacion?: string;
    vendedor?: any; // To avoid circular dependency initially or just use partial User
}
