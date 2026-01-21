import { Component, inject, signal } from '@angular/core';
import { Company, CompanyCreate, CompanyUpdate } from '../models/companies.model';
import { RouterModule } from '@angular/router';
import { CompanyModalComponent } from '../modals/company-modal/company-modal.component';
import { CommonModule } from '@angular/common';
import { CompanySuppliersModalComponent } from '../modals/company-suppliers-modal/company-suppliers-modal.component';
import { ApiError } from '../../../shared/models/api-error.model';
import { CompanyService } from '../../../services/company/company.service';
import { GlobalErrorService } from '../../../shared/services/global-error/global-error.service';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, RouterModule, CompanyModalComponent, CompanySuppliersModalComponent],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.css'
})
export class CompaniesComponent {

  private readonly companyService = inject(CompanyService);
  private readonly globalError = inject(GlobalErrorService);

  loading = signal(true);
  saving = signal(false);
  companies = signal<Company[]>([]);
  isEditModalOpen = signal(false);
  isSuppliersModalOpen = signal(false);
  isCreateModalOpen = signal(false);
  selectedCompany = signal<Company | null>(null);
  selectedCompanyForSuppliers = signal<Company | null>(null);
  page = signal(0);
  size = signal(5);
  totalElements = signal(0);
  totalPages = signal(0);
  searchTerm = signal('');
  searchType = signal<'GENERAL' | 'NAME' | 'CPF/CNPJ'>('GENERAL');

  constructor() {
    this.fetchCompanies();
  }

  private fetchCompanies() {
    this.loading.set(true);

    const page = this.page();
    const size = this.size();
    const query = this.searchTerm();
    const type = this.searchType();

    const request$ = query
      ? this.companyService.search(query, type, page, size)
      : this.companyService.list(page, size);

    request$.subscribe({
      next: (response) => {
        this.companies.set(response.content);
        this.totalElements.set(response.totalElements);
        this.totalPages.set(response.totalPages);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.globalError.show(err.error);
      }
    });
  }

  deleteCompany(id: number) {
    if (!confirm('Are you sure you want to delete this company?')) return;

    this.loading.set(true);

    this.companyService.delete(id).subscribe({
      next: () => {
        if (this.companies().length === 1 && this.page() > 0) {
          this.page.update(p => p - 1);
        }

        this.fetchCompanies();
      },
      error: (err) => {
        this.loading.set(false);
        this.globalError.show(err.error);
      }
    });
  }

  nextPage() {
    if (this.page() + 1 < this.totalPages()) {
      this.page.update(p => p + 1);
      this.fetchCompanies();
    }
  }

  previousPage() {
    if (this.page() > 0) {
      this.page.update(p => p - 1);
      this.fetchCompanies();
    }
  }

  search() {
    this.page.set(0);
    this.fetchCompanies();
  }

  changeSearchType(type: 'GENERAL' | 'NAME' | 'CPF/CNPJ') {
    this.searchType.set(type);
    this.page.set(0);
    this.fetchCompanies();
  }

  openCreateModal() {
    this.isCreateModalOpen.set(true);
  }

  closeCreateModal() {
    this.isCreateModalOpen.set(false);
  }

  onCompanyCreated() {
    this.page.set(0);
    this.fetchCompanies();
  }

  openEditModal(company: Company) {
    this.selectedCompany.set(company);
    this.isEditModalOpen.set(true);
  }

  closeEditModal() {
    this.isEditModalOpen.set(false);
    this.selectedCompany.set(null);
  }

  updateCompany(payload: CompanyUpdate) {
    this.saving.set(true);

    this.companyService.update(payload.id, payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.closeEditModal();
        this.page.set(0);
        this.fetchCompanies();
      },
      error: (err) => {
        this.saving.set(false);
        this.globalError.show(err.error);
      }
    });
  }

  openSuppliersModal(company: Company) {
    this.selectedCompanyForSuppliers.set(company);
    this.isSuppliersModalOpen.set(true);
  }

  closeSuppliersModal() {
    this.isSuppliersModalOpen.set(false);
    this.selectedCompanyForSuppliers.set(null);
  }

  saveCompany(payload: CompanyCreate) {
    this.saving.set(true);

    this.companyService.create(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.onCompanyCreated();
      },
      error: (err) => {
        this.saving.set(false);
        this.globalError.show(err.error);
      }
    });
  }

  handleSave(payload: CompanyCreate | CompanyUpdate) {
    if ('id' in payload) {
      this.updateCompany(payload);
    } else {
      this.saveCompany(payload);
    }
  }
}
