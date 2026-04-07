export interface PaginatedResponse<T> {
    content: T[];
    // Formato antiguo/plano
    totalElements?: number;
    totalPages?: number;
    size?: number;
    number?: number;
    
    // Formato nuevo/anidado (Spring Data REST / PagedModel)
    page?: {
        totalElements: number;
        totalPages: number;
        size: number;
        number: number;
    }
}
