export class DocumentValidator {
  static isValid(value: string): boolean {
    const digits = value.replace(/\D/g, '');

    if(this.isAllSame(digits)) return false;

    if (digits.length === 11) {
      return this.validCpf(digits);
    }

    if (digits.length === 14) {
      return this.validCnpj(digits);
    }

    return false;
  }

  private static validCpf(cpf: string | null): boolean {
    if (!cpf) return false;

    if (!/^\d{11}$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 10; i >= 2; i--) {
      sum += parseInt(cpf.charAt(10 - i)) * i;
    }

    let mod = (sum * 10) % 11;
    if (mod === 10) mod = 0;
    if (mod !== parseInt(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 11; i >= 3; i--) {
      sum += parseInt(cpf.charAt(11 - i)) * i;
    }

    mod = ((sum + mod * 2) * 10) % 11;
    if (mod === 10) mod = 0;

    return mod === parseInt(cpf.charAt(10));
  }

  private static validCnpj(cnpj: string | null): boolean {
    if (!cnpj) return false;

    if (!/^\d{14}$/.test(cnpj)) return false;

    const weights1 = [5,4,3,2,9,8,7,6,5,4,3,2];
    let sum = 0;

    for (let i = 0; i < 12; i++) {
      sum += parseInt(cnpj.charAt(i)) * weights1[i];
    }

    let mod = sum % 11;

    if (mod === 0 || mod === 1) mod = 0;
    else mod = 11 - mod;

    if (mod !== parseInt(cnpj.charAt(12))) return false;

    const weights2 = [6, ...weights1];
    sum = 0;

    for (let i = 0; i < 13; i++) {
      sum += parseInt(cnpj.charAt(i)) * weights2[i];
    }

    mod = sum % 11;

    if (mod === 0 || mod === 1) mod = 0;
    else mod = 11 - mod;

    return mod === parseInt(cnpj.charAt(13));
  }

  private static isAllSame(s: string): boolean {
    return s.length > 0 && /^(.)\1*$/.test(s);
  }
}