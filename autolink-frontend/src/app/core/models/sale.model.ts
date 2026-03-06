import { User } from './user.model';

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
    cliente: User;
}
