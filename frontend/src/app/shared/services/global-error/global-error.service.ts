import { Injectable, signal } from '@angular/core';
import { ApiError } from '../../models/api-error.model';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorService {
  readonly error = signal<ApiError | null>(null);

  show(error: ApiError) {
    this.error.set(error);
  }

  clear() {
    this.error.set(null);
  }
}
