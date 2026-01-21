import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/pages/home.component';

export const routes: Routes = [
{ path: '', component: HomeComponent },
{ path: 'companies', loadComponent: () => import('./features/companies/pages/companies.component').then(m => m.CompaniesComponent) },
{ path: 'suppliers', loadComponent: () => import('./features/suppliers/pages/suppliers.component').then(m => m.SuppliersComponent) },
{ path: '**', redirectTo: '' }
];
