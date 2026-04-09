export enum Rol {
    CLIENTE = 'CLIENTE',
    VENDEDOR = 'VENDEDOR',
    ADMINISTRADOR = 'ADMINISTRADOR'
}

export interface User {
    id: number;
    nombre: string;
    apellidos: string;
    DNI: string;
    correo: string;
    rol: Rol;
    telefono?: number;
    salarioAnual?: number;
    ciudadAsignada?: string;
    activo: boolean;
    fotoPerfil?: string;
}
