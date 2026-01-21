import { Component, effect, inject, input, output, signal } from '@angular/core';
import { Company } from '../../models/companies.model';
import { Supplier } from '../../../suppliers/models/suppliers.model';
import { CompanyService } from '../../../../services/company/company.service';
import { GlobalErrorService } from '../../../../shared/services/global-error/global-error.service';
import { SupplierService } from '../../../../services/supplier/supplier.service';

@Component({
  selector: 'app-company-suppliers-modal',
  standalone: true,
  imports: [],
  templateUrl: './company-suppliers-modal.component.html',
  styleUrl: './company-suppliers-modal.component.css',
})
export class CompanySuppliersModalComponent {

  private supplierService = inject(SupplierService);
  private readonly globalError = inject(GlobalErrorService);
  
  private filteredSuppliers: Supplier[] = [];
  private allSuppliers: Supplier[] = [];
  
  company = input<Company | null>(null);
  open = input<boolean>(false);
  close = output<void>();
  loading = signal(true);
  suppliers = signal<Supplier[]>([]);
  page = signal(0);
  size = signal(3);
  totalPages = signal(0);
  totalElements = signal(0);

  constructor() {
    effect(() => {
      const company = this.company();
      if(!company) return;

      this.loading.set(true);
      this.page.set(0);

      this.fetchSuppliers(company.suppliersIds ?? []);
      });
  }

  private fetchSuppliers(companySuppliersIds: number[]) {
    this.supplierService.list(0, 999999).subscribe({
      next: (suppliers) => {
        this.allSuppliers = suppliers.content;
        this.filterSuppliers(companySuppliersIds);
      },
      error: (err) => {
        this.allSuppliers = [];
        this.globalError.show(err.error);
      }
    });
  }

  private filterSuppliers(companySuppliersIds: number[]) {
    if (!companySuppliersIds.length) {
      this.suppliers.set([]);
      this.totalElements.set(0);
      this.totalPages.set(0);
      this.loading.set(false);
      return;
    }

    const filtered = this.allSuppliers.filter(s =>
      companySuppliersIds.includes(s.id)
    );

    this.filteredSuppliers = filtered;
    this.applyPagination();
  }

  private applyPagination() {
    const start = this.page() * this.size();
    const end = start + this.size();

    this.suppliers.set(this.filteredSuppliers.slice(start, end));
    this.totalElements.set(this.filteredSuppliers.length);
    this.totalPages.set(
      Math.ceil(this.filteredSuppliers.length / this.size())
    );
    this.loading.set(false);
  }

  nextPage() {
    if (this.page() + 1 < this.totalPages()) {
      this.page.update(p => p + 1);
      this.applyPagination();
    }
  }

  previousPage() {
    if (this.page() > 0) {
      this.page.update(p => p - 1);
      this.applyPagination();
    }
  }
}

