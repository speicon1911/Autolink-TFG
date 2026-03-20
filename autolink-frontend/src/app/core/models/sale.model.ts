import { User } from './user.model';
import { Vehicle } from './vehicle.model';

export enum EstadoVenta {
    PENDIENTE = 'PENDIENTE',
    COMPLETADA = 'COMPLETADA',
    CANCELADA = 'CANCELADA'
}

export interface Sale {
    idVenta: number;
    fecha: string;
    estadoVenta: EstadoVenta;
    precio: number;
    vendedor: Partial<User>;
    cliente: Partial<User>;
    vehiculo: Partial<Vehicle>;
}
