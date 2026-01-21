import { FederativeUnit } from "../../../shared/models/federative-units.model";
import { SupplierType } from "../../../shared/models/supplier-type.model";
import { Company, CompanySummary } from "../../companies/models/companies.model";

export interface Supplier {
  id: number;
  name: string;
  type: SupplierType;
  cpfCnpj: string;
  rg?: string;
  birthdate?: string;
  email: string;
  cep: string;
  uf: FederativeUnit;
  companies?: Company[];
  companiesIds?: number[];
}

export interface SupplierCreate {
  name: string;
  type: SupplierType;
  cpfCnpj: string;
  rg?: string | null;
  birthdate?: string | null;
  email: string;
  cep: string;
  uf: FederativeUnit;
}

export interface SupplierUpdate {
  id: number;
  name: string;
  rg?: string | null;
  birthdate?: string | null;
  email: string;
  cep: string;
  uf: FederativeUnit;
  companiesIds?: number[];
}

export interface SupplierSummary {
  name: string;
  type: SupplierType;
  cpfCnpj: string;
  rg?: string;
  birthdate?: string;
  email: string;
  cep: string;
  uf: FederativeUnit;
}