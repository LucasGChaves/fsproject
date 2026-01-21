import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../../shared/models/page.model';
import { Company } from '../../features/companies/models/companies.model';
import { Supplier, SupplierCreate, SupplierUpdate } from '../../features/suppliers/models/suppliers.model';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  
  private readonly API = 'http://localhost:8080/suppliers';

  constructor(private http: HttpClient) {}

  list(page=0, size=5): Observable<Page<Supplier>> {
    const params = new HttpParams().set('page', page).set('size', size);

    return this.http.get<Page<Supplier>>(this.API, {params});
  }

  search(query: string, type: string, page=0, size=10): Observable<Page<Supplier>> {
    if (type == 'CPF/CNPJ') type = 'CPF_CNPJ';
    const params = new HttpParams().set('query', query).set('type', type).set('page', page).set('size', size);

    return this.http.get<Page<Supplier>>(`${this.API}/search`, {params});
  }

  getById(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.API}/${id}`);
  }

  create(payload: SupplierCreate): Observable<Supplier> {
    return this.http.post<Supplier>(this.API, payload);
  }

  update(id: number, payload: SupplierUpdate): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.API}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
