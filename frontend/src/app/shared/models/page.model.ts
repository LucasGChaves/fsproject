export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
}