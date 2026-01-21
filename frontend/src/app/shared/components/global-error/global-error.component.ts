import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalErrorService } from '../../services/global-error/global-error.service';

@Component({
  selector: 'app-global-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './global-error.component.html'
})
export class GlobalErrorComponent {
  readonly errorService = inject(GlobalErrorService);
}