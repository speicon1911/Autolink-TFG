import { User } from './user.model';
import { Vehicle } from './vehicle.model';

export enum EstadoVenta {
    EN_PROGRESO = 'EN_PROGRESO',
    REALIZADA = 'REALIZADA',
    ANULADA = 'ANULADA'
}

export interface Sale {
    idVenta: number;
    fecha: string;
    estadoVenta: EstadoVenta;
    precio: number;
    rolUltimoModificador?: string;
    vendedor: Partial<User>;
    cliente: Partial<User>;
    vehiculo: Partial<Vehicle>;
}
