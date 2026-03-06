import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getAccessToken();

    let authReq = req;
    if (token) {
        authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            // Handle 401 Unauthorized for Refresh Token logic
            if (error.status === 401 && !req.url.includes('/auth/refresh') && !req.url.includes('/auth/login')) {
                const refreshToken = authService.getRefreshToken();

                if (refreshToken) {
                    return authService.refreshToken(refreshToken).pipe(
                        switchMap((response) => {
                            // Retry with new token
                            const nexReq = req.clone({
                                setHeaders: {
                                    Authorization: `Bearer ${response.access}`
                                }
                            });
                            return next(nexReq);
                        }),
                        catchError((refreshError) => {
                            authService.logout();
                            return throwError(() => refreshError);
                        })
                    );
                } else {
                    authService.logout();
                }
            }
            return throwError(() => error);
        })
    );
};
