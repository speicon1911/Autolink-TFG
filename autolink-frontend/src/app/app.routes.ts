import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { Rol } from './core/models/user.model';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./shared/layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
        children: [
            {
                path: '',
                loadComponent: () => import('./features/public/vehicle-catalog/vehicle-catalog.component').then(m => m.VehicleCatalogComponent),
            },
            {
                path: 'login',
                loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
            },
            {
                path: 'registrar',
                loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
            },
            {
                path: 'register',
                redirectTo: 'registrar',
                pathMatch: 'full'
            },
            {
                path: 'vehiculo/:id',
                loadComponent: () => import('./features/public/vehicle-details/vehicle-details.component').then(m => m.VehicleDetailsComponent),
            },
            {
                path: 'cliente',
                canActivate: [authGuard, roleGuard([Rol.CLIENTE])],
                loadComponent: () => import('./features/client/dashboard/dashboard.component').then(m => m.ClientDashboardComponent),
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./features/client/profile/profile.component').then(m => m.ClientProfileComponent),
                    },
                    {
                        path: 'compras',
                        loadComponent: () => import('./features/client/purchases/purchases.component').then(m => m.ClientPurchasesComponent),
                    }
                ]
            },
            {
                path: 'vendedor',
                canActivate: [authGuard, roleGuard([Rol.VENDEDOR])],
                loadComponent: () => import('./features/seller/dashboard/dashboard.component').then(m => m.SellerDashboardComponent),
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./features/seller/stock/stock.component').then(m => m.SellerStockComponent),
                    },
                    {
                        path: 'ventas',
                        loadComponent: () => import('./features/seller/sales/sales.component').then(m => m.SellerSalesComponent),
                    }
                ]
            },
            {
                path: 'admin',
                canActivate: [authGuard, roleGuard([Rol.ADMINISTRADOR])],
                loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent),
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./features/admin/users/users.component').then(m => m.AdminUsersComponent),
                    },
                    {
                        path: 'verificaciones',
                        loadComponent: () => import('./features/admin/verifications/verifications.component').then(m => m.AdminVerificationsComponent),
                    },
                    {
                        path: 'auditoria',
                        loadComponent: () => import('./features/admin/audit/audit.component').then(m => m.AdminAuditComponent),
                    }
                ]
            }
        ]
    }
];
