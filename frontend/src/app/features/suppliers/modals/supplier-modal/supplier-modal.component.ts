import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { CompanyService } from '../../../../services/company/company.service';
import { CepService } from '../../../../shared/services/cep/cep.service';
import { GlobalErrorService } from '../../../../shared/services/global-error/global-error.service';
import { Supplier, SupplierCreate, SupplierUpdate } from '../../models/suppliers.model';
import { FederativeUnit } from '../../../../shared/models/federative-units.model';
import { Company } from '../../../companies/models/companies.model';
import { DocumentValidator } from '../../../../shared/utils/document-validator';
import { DocumentMask } from '../../../../shared/utils/document-mask';
import { SupplierType } from '../../../../shared/models/supplier-type.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-supplier-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './supplier-modal.component.html',
  styleUrl: './supplier-modal.component.css',
})
export class SupplierModalComponent {
  private readonly companyService = inject(CompanyService);
  private readonly cepService = inject(CepService);
  private readonly globalError = inject(GlobalErrorService);

  open = input<boolean>(false);
  close = output<void>();
  saved = output<SupplierCreate | SupplierUpdate>();
  supplier = input<Supplier | null>(null);
  cepNotFound = signal(false);

  name = signal('');
  type = signal<SupplierType | null>(null);
  cpfCnpj = signal('');
  rg = signal('');
  birthdate = signal('');
  email = signal('');
  cep = signal('');
  uf = signal<FederativeUnit | ''>('');

  touchedName = signal(false);
  touchedType = signal(false);
  touchedCpfCnpj = signal(false);
  touchedRg = signal(false);
  touchedBirthdate = signal(false);
  touchedEmail = signal(false);
  touchedCep = signal(false);
  today = signal(new Date().toISOString().split('T')[0]);

  isNameInvalid = () => this.touchedName() && !this.name().trim();
  isTypeInvalid = () => this.touchedType() &&  !this.type();
  isCepInvalid = () => this.touchedCep() && (!this.cep().trim() || this.cepNotFound());

  isCpfCnpjEmpty = () => this.touchedCpfCnpj() && !this.cpfCnpj().trim();
  isRgEmpty = () => this.type() === 'PF' && this.touchedRg() && !this.rg().trim();
  isBirthdateEmpty = () => this.type() === 'PF' && this.touchedBirthdate() && !this.birthdate();
  isEmailEmpty = () => this.touchedEmail() && !this.email().trim();

  isNameValid = computed(() => this.name().trim().length > 0);
  isTypeValid = computed(() => this.type() === 'PF' || this.type() === 'PJ');
  isCepValid = computed(() => this.cep().length === 8 && !this.cepNotFound());
  isCpfCnpjValid = computed(() => {
    if (!this.cpfCnpj()) return false;
      return DocumentValidator.isValid(this.cpfCnpj());
  });

  isBirthdateValid = computed(() => {
    if (this.type() !== 'PF') return true;
    return !!this.birthdate()
  });


  isRgValid = computed(() => {
    if (this.type() !== 'PF') return true;

    const rawRg = this.rg().replace(/\D/g, '');
    return rawRg.length >= 7 && rawRg.length <= 11;
  });

  isEmailValid = computed(() => {
    const email = this.email();
    if (!email) return false;

    const hasAtSymbol = email.includes('@');
    const hasValidDomain = /\.(com|com\.br|org|net|edu|gov|br)$/i.test(email.split('@')[1] || '');

    return hasAtSymbol && hasValidDomain;
  });

  isPf = computed(() => this.type() === 'PF');

  maskedCpfCnpj = computed(() => DocumentMask.maskedDocument(this.cpfCnpj()));

  cpfCnpjLabel = computed(() => {
    if (this.type() === 'PF') return 'CPF';
    if (this.type() === 'PJ') return 'CNPJ';
    return 'CPF/CNPJ';
  });

  cpfCnpjReadonly = computed(() => {
  const isCreateMode = !this.supplier();
  const type = this.type() ?? '';
  const hasValidType = type === 'PF' || type === 'PJ';

  return !(isCreateMode && hasValidType);
});

  isFormValid = computed(() => {
    if (this.type() === 'PF') {
      return this.isNameValid() && this.isTypeValid() && this.isCepValid()
      && this.isCpfCnpjValid() && this.isEmailValid()
      && this.isRgValid() && this.isBirthdateValid();
    } else {
      return this.isNameValid() && this.isTypeValid() && this.isCepValid()
      && this.isCpfCnpjValid() && this.isEmailValid();
    }
  });

  constructor() {    
    effect(() => {
      const supplier = this.supplier();
      
      if (!supplier) return;
      
      this.name.set(supplier.name);
      this.cpfCnpj.set(supplier.cpfCnpj);
      this.email.set(supplier.email);
      this.cep.set(supplier.cep);
      this.uf.set(supplier.uf);
      this.type.set(supplier.type);

      if (supplier.type === 'PF' && supplier.rg && supplier.birthdate) {
        this.rg.set(supplier.rg);
        this.birthdate.set(supplier.birthdate);
      }
    });

    effect(() => {
      if (!this.open()) return;
      if (this.supplier()) return;

      this.resetForm();
    });
  }

  private resetForm() {
    this.name.set('');
    this.type.set(null);
    this.cpfCnpj.set('');
    this.rg.set('');
    this.birthdate.set('');
    this.email.set('');
    this.cep.set('');
    this.uf.set('');

    this.touchedName.set(false);
    this.touchedType.set(false);
    this.touchedCpfCnpj.set(false);
    this.touchedRg.set(false);
    this.touchedBirthdate.set(false);
    this.touchedEmail.set(false);
    this.touchedCep.set(false);
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
      }
    })
  }

  private formatDateForApi(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  onCpfCnpjInput(event: Event) {
    if (!this.type()) return;

    const input = event.target as HTMLInputElement;
    const rawInput = input.value.replace(/\D/g, '');
    const fixedInput =  this.type() === 'PF' ? rawInput.slice(0, 11) : rawInput.slice(0, 14);
    
    this.cpfCnpj.set(fixedInput);
    input.value = this.maskedCpfCnpj();
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

  onEmailInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const rawInput = input.value.trim();
    
    this.email.set(rawInput);
  }

  onRgInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const rawInput = input.value.replace(/\D/g, '');
    const fixedInput = rawInput.slice(0, 11);
    
    this.rg.set(fixedInput);
    input.value = fixedInput;
  }

  onTypeChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    const newType: SupplierType | null =
      value === 'PF' || value === 'PJ' ? (value as SupplierType) : null;

    const previousType = this.type();

    this.type.set(newType);

    if (previousType !== newType) {
      this.cpfCnpj.set('');
    }

    if (previousType === 'PF' && newType === 'PJ') {
      this.rg.set('');
      this.birthdate.set('');
      this.touchedRg.set(false);
      this.touchedBirthdate.set(false);
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
      type: this.type() as SupplierType,
      rg: this.type() === 'PF' ? this.rg() ?? null : null,
      birthdate: this.type() === 'PF' ? this.formatDateForApi(this.birthdate()) ?? null : null,
      cpfCnpj: this.cpfCnpj(),
      email: this.email(),
      cep: this.cep(),
      uf: this.uf() as FederativeUnit,
    };

    if (this.supplier()?.id) {
      const payload: SupplierUpdate = {
        id: this.supplier()!.id,
        ...basePayload,
      };
      this.saved.emit(payload);
    } else {
      const payload: SupplierCreate = basePayload;
      this.saved.emit(payload);
    }

    this.close.emit();
    this.resetForm();
  }
}
