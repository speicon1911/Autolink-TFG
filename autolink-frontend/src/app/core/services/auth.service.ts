import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, map, switchMap, of, catchError } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/auth.model';
import { User, Rol } from '../models/user.model';
import { jwtDecode } from 'jwt-decode';
import { PersonaService } from './persona.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);
    private readonly personaService = inject(PersonaService);
    private readonly apiUrl = 'http://localhost:8082/auth';

    private currentUser = signal<User | null>(null);
    public readonly currentUser$ = this.currentUser.asReadonly();
    public readonly isAuthenticated = computed(() => !!this.currentUser());

    constructor() {
        this.loadUserFromStorage();
    }

    private loadUserFromStorage() {
        if (typeof window !== 'undefined' && window.localStorage) {
            const userJson = localStorage.getItem('user');
            if (userJson) {
                try {
                    this.currentUser.set(JSON.parse(userJson));
                } catch (e) {
                    this.logout();
                }
            }
        }
    }

    login(credentials: LoginRequest): Observable<User | null> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
            switchMap(response => this.handleAuthentication(response))
        );
    }

    register(data: RegisterRequest): Observable<User | null> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/register`, data).pipe(
            switchMap(response => this.handleAuthentication(response))
        );
    }

    refreshToken(currentRefreshToken: string): Observable<LoginResponse> {
        // Backend maps RefreshDTO to field 'refresh'
        return this.http.post<LoginResponse>(`${this.apiUrl}/refresh`, { refresh: currentRefreshToken }).pipe(
            switchMap(response => {
                this.saveTokens(response.access, response.refresh);
                return of(response);
            })
        );
    }

    logout() {
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
        }
        this.currentUser.set(null);
        this.router.navigate(['/login']);
    }

    private saveTokens(access: string, refresh: string) {
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
        }
    }

    private handleAuthentication(response: LoginResponse): Observable<User | null> {
        this.saveTokens(response.access, response.refresh);

        try {
            const decoded: any = jwtDecode(response.access);
            const email = decoded.sub;
            const roles: string[] = decoded.roles || [];

            // If the backend already provided profile info, use it!
            if (response.id && response.nombre) {
                console.log('Login: Profile received from backend', response.nombre);
                const user: User = {
                    id: response.id,
                    nombre: response.nombre,
                    apellidos: response.apellidos || '',
                    DNI: '', // Not in response but not needed for basic stock ops
                    correo: response.correo || email,
                    rol: (response.rol as Rol) || (roles[0]?.includes('ADMIN') ? Rol.ADMINISTRADOR : Rol.VENDEDOR),
                    activo: response.activo !== undefined ? response.activo : true
                };
                if (typeof window !== 'undefined' && window.localStorage) {
                    localStorage.setItem('user', JSON.stringify(user));
                    this.currentUser.set(user);
                }
                return of(user);
            }

            console.log('Login: Decoded Token', { email, roles });
            // Fallback to fetching or partial profile
            let profileFetch: Observable<any[]>;
            const isAdmin = roles.some(r => r.toUpperCase().includes('ADMIN'));
            const isVendedor = roles.some(r => r.toUpperCase().includes('VENDEDOR'));

            if (isAdmin) {
                profileFetch = this.personaService.listPersonas();
            } else if (isVendedor) {
                profileFetch = this.personaService.listVendedores();
            } else {
                profileFetch = this.personaService.listClientes();
            }

            return profileFetch.pipe(
                map(personas => {
                    const user = personas.find(p => p.correo.toLowerCase() === email.toLowerCase()) || null;
                    if (user) {
                        if (typeof window !== 'undefined' && window.localStorage) {
                            localStorage.setItem('user', JSON.stringify(user));
                            this.currentUser.set(user);
                        }
                    }
                    return user;
                }),
                catchError((err) => {
                    console.error('Failed to fetch profile (Likely 403 or missing endpoint):', err);
                    const partialUser: User = {
                        id: 0,
                        nombre: email.split('@')[0],
                        apellidos: '',
                        DNI: '',
                        correo: email,
                        rol: isAdmin ? Rol.ADMINISTRADOR : (isVendedor ? Rol.VENDEDOR : Rol.CLIENTE),
                        telefono: 0,
                        salarioAnual: 0,
                        activo: true
                    };
                    if (typeof window !== 'undefined' && window.localStorage) {
                        localStorage.setItem('user', JSON.stringify(partialUser));
                        this.currentUser.set(partialUser);
                    }
                    return of(partialUser);
                })
            );
        } catch (e) {
            this.logout();
            return of(null);
        }
    }

    getAccessToken(): string | null {
        return typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    }

    getRefreshToken(): string | null {
        return typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
    }
}
