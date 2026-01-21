import { CommonModule } from '@angular/common';
import { Component, computed, effect, EventEmitter, HostListener, inject, input, Input, output, Output, signal } from '@angular/core';
import { Company, CompanyCreate, CompanyUpdate } from '../../models/companies.model';
import { DocumentMask } from '../../../../shared/utils/document-mask';
import { DocumentValidator } from '../../../../shared/utils/document-validator';
import { FederativeUnit } from '../../../../shared/models/federative-units.model';
import { ApiError } from '../../../../shared/models/api-error.model';
import { CepService } from '../../../../shared/services/cep/cep.service'
import { GlobalErrorService } from '../../../../shared/services/global-error/global-error.service';
import { Supplier } from '../../../suppliers/models/suppliers.model';
import { SupplierType } from '../../../../shared/models/supplier-type.model';
import { SupplierService } from '../../../../services/supplier/supplier.service';
import { CompanyService } from '../../../../services/company/company.service';

@Component({
  selector: 'app-company-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-modal.component.html',
  styleUrl: './company-modal.component.css',
})
export class CompanyModalComponent {

  private readonly supplierService = inject(SupplierService);
  private readonly cepService = inject(CepService);
  private readonly globalError = inject(GlobalErrorService);

  open = input<boolean>(false);
  close = output<void>();
  saved = output<CompanyCreate | CompanyUpdate>();

  company = input<Company | null>(null);

  name = signal('');
  cnpj = signal('');
  cep = signal('');
  uf = signal<FederativeUnit | ''>('');

  touchedName = signal(false);
  touchedCnpj = signal(false);
  touchedCep = signal(false);

  suppliers = signal<Supplier[]>([]);
  selectedSupplierIds = signal<number[]>([]);
  isSuppliersOpen = signal(false);

  cepNotFound = signal(false);

  isNameInvalid = () => this.touchedName() && !this.name().trim();
  isCnpjEmpty = () => this.touchedCnpj() && !this.cnpj().trim();
  isCepInvalid = () => this.touchedCep() && (!this.cep().trim() || this.cepNotFound());

  isNameValid = computed(() => this.name().trim().length > 0);
  isCepValid = computed(() => this.cep().length === 8 && !this.cepNotFound());
  isCnpjValid = computed(() => {
    if (!this.cnpj()) return false;
      return DocumentValidator.isValid(this.cnpj());
  });

  maskedCnpj = computed(() => DocumentMask.maskedDocument(this.cnpj()));


  isFormValid = computed(() => this.isNameValid() && this.isCnpjValid() && this.isCepValid());

  constructor() {
    this.fetchSuppliers();
    
    effect(() => {
      const company = this.company();
      
      if (!company) return;
      
      this.name.set(company.name);
      this.cnpj.set(company.cnpj);
      this.cep.set(company.cep);
      this.uf.set(company.uf);

      if (company.suppliersIds && company.suppliersIds.length > 0) {
        this.selectedSupplierIds.set(company.suppliersIds);
      } else if (company.suppliers && company.suppliers.length > 0) {
        this.selectedSupplierIds.set(
          company.suppliers.map(s => s.id)
        );
      } else {
        this.selectedSupplierIds.set([]);
      }
      
      this.resetTouched();
    });

    effect(() => {
      if (!this.open()) return;
      if (this.company()) return;

      this.resetForm();
    });
  }

  private resetForm() {
    this.name.set('');
    this.cnpj.set('');
    this.cep.set('');
    this.uf.set('');
    this.selectedSupplierIds.set([]);
    this.resetTouched();
  }

  private lookupCep(cep: string) {
    this.cepService.getUfByCep(cep).subscribe({
      next: (response) => {
        this.uf.set(response.uf);
        this.cepNotFound.set(false);
      },
      error: (err) => {
        this.cepNotFound.set(true);
        this.uf.set('');
        console.log(err.error);
      }
    })
  }

  onCnpjInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const rawInput = input.value.replace(/\D/g, '');
    const fixedInput = rawInput.slice(0, 14);
    
    this.cnpj.set(fixedInput);
    input.value = this.maskedCnpj();
  }

  onCepInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const raw = input.value.replace(/\D/g, '').slice(0, 8);

    this.cep.set(raw);
    input.value = raw;

    this.cepNotFound.set(false);
    this.uf.set('');

    if (raw.length === 8) {
      this.lookupCep(raw);
    }
  }

  cancel() {
    this.resetForm();
    this.close.emit();
  }

  save() {
    if (!this.isFormValid()) return;

    const basePayload = {
      name: this.name(),
      cnpj: this.cnpj(),
      cep: this.cep(),
      uf: this.uf() as FederativeUnit,
      suppliersIds: this.selectedSupplierIds(),
    };

    if (this.company()?.id) {
      const payload: CompanyUpdate = {
        id: this.company()!.id,
        ...basePayload,
      };
      this.saved.emit(payload);
    } else {
      const payload: CompanyCreate = basePayload;
      this.saved.emit(payload);
    }

    this.close.emit();
    this.resetForm();
  }

  toggleSuppliers() {
    this.isSuppliersOpen.update(v => !v);
  }

  toggleSupplier(id: number) {
    const current = this.selectedSupplierIds();

    this.selectedSupplierIds.set(
      current.includes(id) ? current.filter(s => s !== id) : [...current, id]
    );
  }

  supplierName(id: number): string {
    return this.suppliers().find(s => s.id === id)?.name ?? '';
  }

  private resetTouched() {
    this.touchedName.set(false);
    this.touchedCnpj.set(false);
    this.touchedCep.set(false);
  }

  private fetchSuppliers() {
    this.supplierService.list(0, 999999).subscribe({
      next: (suppliers) => this.suppliers.set(suppliers.content),
      error: (err) => this.globalError.show(err.error)
    });
  }

  @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
      if (!this.isSuppliersOpen()) return;

      const target = event.target as HTMLElement;

      if (!target.closest('#suppliers-container')) {
        this.isSuppliersOpen.set(false);
      }
    }
}
