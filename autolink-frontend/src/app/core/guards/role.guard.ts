import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Rol } from '../models/user.model';

export const roleGuard: (allowedRoles: Rol[]) => CanActivateFn = (allowedRoles) => {
    return () => {
        const authService = inject(AuthService);
        const router = inject(Router);
        const user = authService.currentUser$();

        if (user && allowedRoles.includes(user.rol)) {
            return true;
        }

        router.navigate(['/']); // Redirect to home or unauthorized page
        return false;
    };
};
