import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { FederativeUnit } from '../../models/federative-units.model'

export interface CepResponse {
  uf: FederativeUnit;
  notFound: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CepService {
  
  private readonly API = 'http://localhost:8080/cep';

  constructor(private http: HttpClient) {}

    getUfByCep(cep: string): Observable<CepResponse> {
      const cleanCep = cep.replace(/\D/g, '');
      
      // Verifica se tem 8 dígitos
      if (cleanCep.length !== 8) {
        return of({ uf: '' as FederativeUnit, notFound: true });
      }
      
      return this.http.get<CepResponse>(`${this.API}/${cleanCep}`);
    }
}
