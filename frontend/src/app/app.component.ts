import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/layout/header/header.component';
import { FooterComponent } from './core/layout/footer/footer.component';
import { NavbarComponent } from './core/layout/navbar/navbar.component';
import { GlobalErrorComponent } from './shared/components/global-error/global-error.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, NavbarComponent, GlobalErrorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App {
  private readonly router = inject(Router);

  isHome() {
    return this.router.url === '/';
  }
}
