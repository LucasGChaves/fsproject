import { Component, inject, signal } from '@angular/core';
import { Supplier, SupplierCreate, SupplierUpdate } from '../models/suppliers.model';
import { SupplierService } from '../../../services/supplier/supplier.service';
import { GlobalErrorService } from '../../../shared/services/global-error/global-error.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupplierModalComponent } from '../modals/supplier-modal/supplier-modal.component';
import { SupplierCompaniesModalComponent } from '../modals/supplier-companies-modal/supplier-companies-modal.component';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, RouterModule, SupplierModalComponent, SupplierCompaniesModalComponent],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.css',
})
export class SuppliersComponent {
  
  private readonly supplierService = inject(SupplierService);
  private readonly globalError = inject(GlobalErrorService);

  loading = signal(true);
  saving = signal(false);
  suppliers = signal<Supplier[]>([]);
  selectedSupplier = signal<Supplier | null>(null);
  selectedSupplierForCompanies = signal<Supplier | null>(null);
  isCompaniesModalOpen = signal(false);
  isEditModalOpen = signal(false);
  isCreateModalOpen = signal(false);
  page = signal(0);
  size = signal(5);
  totalElements = signal(0);
  totalPages = signal(0);
  searchTerm = signal('');
  searchType = signal<'GENERAL' | 'NAME' | 'CPF/CNPJ'>('GENERAL');

  constructor() {
    this.fetchSuppliers();
  }

  private fetchSuppliers() {
    this.loading.set(true);

    const page = this.page();
    const size = this.size();
    const query = this.searchTerm();
    const type = this.searchType();

    const request$ = query
      ? this.supplierService.search(query, type, page, size)
      : this.supplierService.list(page, size);

    request$.subscribe({
      next: (response) => {
        this.suppliers.set(response.content);
        this.totalElements.set(response.totalElements);
        this.totalPages.set(response.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  deleteSupplier(id: number) {
    if (!confirm('Are you sure you want to delete this company?')) return;

    this.loading.set(true);

    this.supplierService.delete(id).subscribe({
      next: () => {
        if (this.suppliers().length === 1 && this.page() > 0) {
          this.page.update(p => p - 1);
        }

        this.fetchSuppliers();
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
      this.fetchSuppliers();
    }
  }

  previousPage() {
    if (this.page() > 0) {
      this.page.update(p => p - 1);
      this.fetchSuppliers();
    }
  }

  search() {
    this.page.set(0);
    this.fetchSuppliers();
  }

  changeSearchType(type: 'GENERAL' | 'NAME' | 'CPF/CNPJ') {
    this.searchType.set(type);
    this.page.set(0);
    this.fetchSuppliers();
  }

  openCreateModal() {
    this.isCreateModalOpen.set(true);
  }

  closeCreateModal() {
    this.isCreateModalOpen.set(false);
  }

  onSupplierCreated() {
    this.page.set(0);
    this.fetchSuppliers();
  }

  openEditModal(supplier: Supplier) {
      this.selectedSupplier.set(supplier);
      this.isEditModalOpen.set(true);
  }
  
  closeEditModal() {
    this.isEditModalOpen.set(false);
    this.selectedSupplier.set(null);
  }

  updateSupplier(payload: SupplierUpdate) {
    this.saving.set(true);

    this.supplierService.update(payload.id, payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.closeEditModal();
        this.page.set(0);
        this.fetchSuppliers();
      },
      error: (err) => {
        this.saving.set(false);
        this.globalError.show(err.error);
      }
    });
  }

  openCompaniesModal(supplier: Supplier) {
    this.selectedSupplierForCompanies.set(supplier);
    this.isCompaniesModalOpen.set(true);
  }

  closeCompaniesModal() {
    this.isCompaniesModalOpen.set(false);
    this.selectedSupplierForCompanies.set(null);
  }

  saveSupplier(payload: SupplierCreate) {
    this.saving.set(true);

    this.supplierService.create(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.onSupplierCreated();
      },
      error: (err) => {
        this.saving.set(false);
        this.globalError.show(err.error);
      }
    });
  }

  handleSave(payload: SupplierCreate | SupplierUpdate) {
    if ('id' in payload) {
      this.updateSupplier(payload);
    } else {
      this.saveSupplier(payload);
    }
  }
}
