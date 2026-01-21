import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { GlobalErrorService } from '../../../../shared/services/global-error/global-error.service';
import { CompanyService } from '../../../../services/company/company.service';
import { Company } from '../../../companies/models/companies.model';
import { Supplier } from '../../models/suppliers.model';
import { SupplierType } from '../../../../shared/models/supplier-type.model';

@Component({
  selector: 'app-supplier-companies-modal',
  standalone: true,
  imports: [],
  templateUrl: './supplier-companies-modal.component.html',
  styleUrl: './supplier-companies-modal.component.css',
})
export class SupplierCompaniesModalComponent {

  private companyService = inject(CompanyService);
  private readonly globalError = inject(GlobalErrorService);

  private filteredCompanies: Company[] = [];
  private allCompanies: Company[] = [];

  supplier = input<Supplier | null>(null);
  open = input<boolean>(false);
  close = output<void>();
  loading = signal(true);
  companies = signal<Company[]>([]);
  page = signal(0);
  size = signal(3);
  totalPages = signal(0);
  totalElements = signal(0);

  cpfCnpjLabel = computed(() => {
    const supplier = this.supplier();

    if (supplier && supplier.type) {
      if (supplier.type === 'PF') return 'CPF';
      if (supplier.type === 'PJ') return 'CNPJ';
    }
    return 'CPF/CNPJ';
  });

  constructor() {
    effect(() => {
      const supplier = this.supplier();
      if(!supplier) return;

      this.loading.set(true);
      this.page.set(0);

      this.fetchCompanies(supplier.companiesIds ?? []);
    });
  }

  private fetchCompanies(supplierCompaniesIds: number[]) {
    this.companyService.list(0, 999999).subscribe({
      next: (companies) => {
        this.allCompanies = companies.content;
        this.filterCompanies(supplierCompaniesIds);
      },
      error: (err) => {
        this.allCompanies = [];
        this.globalError.show(err.error);
      }
    });
  }

  private filterCompanies(supplierCompaniesIds: number[]) {
    if (!supplierCompaniesIds.length) {
      this.companies.set([]);
      this.totalElements.set(0);
      this.totalPages.set(0);
      this.loading.set(false);
      return;
    }

    const filtered = this.allCompanies.filter(s =>
      supplierCompaniesIds.includes(s.id)
    );

    this.filteredCompanies = filtered;
    this.applyPagination();
  }

  private applyPagination() {
    const start = this.page() * this.size();
    const end = start + this.size();

    this.companies.set(this.filteredCompanies.slice(start, end));
    this.totalElements.set(this.filteredCompanies.length);
    this.totalPages.set(
      Math.ceil(this.filteredCompanies.length / this.size())
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
