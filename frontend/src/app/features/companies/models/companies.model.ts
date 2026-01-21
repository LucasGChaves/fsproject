// export interface Company {
//   id: number;
//   name: string;
//   cnpj: string;
//   cep: string;
//   uf: string;
//   suppliersIds: number[];
// }

import { FederativeUnit } from "../../../shared/models/federative-units.model";
import { Supplier, SupplierSummary } from "../../suppliers/models/suppliers.model";

export interface Company {
  id: number;
  name: string;
  cnpj: string;
  cep: string;
  uf: FederativeUnit;
  suppliers?: Supplier[];
  suppliersIds?: number[];
}

export interface CompanyCreate {
  name: string;
  cnpj: string;
  cep: string;
  uf: FederativeUnit;
  suppliersIds?: number[];
}

export interface CompanyUpdate {
  id: number;
  name: string;
  cep: string;
  uf: FederativeUnit;
  suppliersIds?: number[];
}

export interface CompanySummary {
  name: string;
  cnpj: string;
  cep: string;
  uf: FederativeUnit;
}