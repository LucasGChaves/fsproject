import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Page } from '../../shared/models/page.model';
import { Company, CompanyCreate, CompanyUpdate } from '../../features/companies/models/companies.model';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  
  private readonly API = 'http://localhost:8080/companies';

  constructor(private http: HttpClient) {}

  list(page=0, size=5): Observable<Page<Company>> {
    const params = new HttpParams().set('page', page).set('size', size);

    return this.http.get<Page<Company>>(this.API, {params});
  }

  search(query: string, type: string, page=0, size=5): Observable<Page<Company>> {
    if (type == 'CPF/CNPJ') type = 'CPF_CNPJ';
    const params = new HttpParams().set('query', query).set('type', type).set('page', page).set('size', size);

    return this.http.get<Page<Company>>(`${this.API}/search`, {params});
  }

  getById(id: number): Observable<Company> {
  if (id === 10) {
    return of({
      id: 10,
      name: 'Empresa Teste',
      cnpj: '11222333000144',
      cep: '01001000',
      uf: 'SP',
      suppliers: [
        {
          id: 1,
          name: 'João Silva',
          type: 'PF',
          cpfCnpj: '12345678901',
          cep: '01001000',
          uf: 'SP'
        },
        {
          id: 2,
          name: 'Distribuidora Rápida ME',
          type: 'PJ',
          cpfCnpj: '99888777000166',
          cep: '40080000',
          uf: 'BA'
        }
      ],
      suppliersIds: [1, 2]
    } as Company);
  }

  return this.http.get<Company>(`/companies/${id}`);
}

  create(payload: CompanyCreate): Observable<Company> {
    return this.http.post<Company>(this.API, payload);
  }

  update(id: number, payload: CompanyUpdate): Observable<Company> {
    return this.http.put<Company>(`${this.API}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
