import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Catalogo } from './pages/catalogo/catalogo';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { Perfil } from './pages/perfil/perfil';
import { Vehiculo } from './pages/vehiculo/vehiculo';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'home', component: Home},
    {path: 'catalogo', component: Catalogo},
    {path: 'login', component: Login},
    {path: 'registro', component: Registro},
    {path: 'perfil', component: Perfil},
    {path: 'vehiculos', component: Vehiculo},
    {path: '', component: Home},
];
