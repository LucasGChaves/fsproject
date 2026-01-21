package com.accenture.fsproject.util;

import com.accenture.fsproject.exception.BusinessLogicException;

public final class CpfCnpjValidator {
    private CpfCnpjValidator() {}

    public static void valid(String cpfCnpj) {
        if (cpfCnpj == null || cpfCnpj.isBlank()) throw new BusinessLogicException("CPF/CNPJ is required.");

        String digits = cpfCnpj.replaceAll("\\D", "");

        if (isAllSame(digits)) throw new BusinessLogicException("Invalid CPF/CNPJ.");

        if (digits.matches("\\d{11}")) {
            if (!validCpf(digits)) {
                throw new BusinessLogicException("Invalid CPF.");
            }
        } else if (digits.matches("\\d{14}")) {
            if (!validCnpj(digits)) {
                throw new BusinessLogicException("Invalid CNPJ.");
            }
        } else {
            throw new BusinessLogicException("Invalid CPF/CNPJ.");
        }
    }

    private static boolean validCpf(String cpf) {
        if (cpf == null) return false;

        String digits = cpf.replaceAll("\\D", "");

        if (!digits.matches("\\d{11}")) {
            return false;
        }

        int sum = 0;

        for (int i = 10; i >= 2; i--) {
            sum += Character.getNumericValue(digits.charAt(10 - i)) * i;
        }

        sum *= 10;
        int mod = sum % 11;

        if (mod == 10) mod = 0;

        if((char)(mod + '0') != digits.charAt(9)) return false;

        sum = 0;

        for (int i = 11; i >= 3; i--) {
            sum += Character.getNumericValue(digits.charAt(11 - i)) * i;
        }

        sum += mod * 2;
        sum *= 10;
        mod = sum % 11;

        if (mod == 10) mod = 0;

        return (char)(mod + '0') == digits.charAt(10);
    }

    private static boolean validCnpj(String cnpj) {
        if (cnpj == null) return false;

        String digits = cnpj.replaceAll("\\D", "");

        if (!digits.matches("\\d{14}")) {
            return false;
        }

        int[] weights = {5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
        int sum = 0;

        for (int i=0; i<12; i++) {
            sum += Character.getNumericValue(digits.charAt(i)) * weights[i];
        }

        int mod = sum % 11;

        if (mod == 0 || mod == 1) mod = 0;
        else mod = 11 - mod;

        if((char)(mod + '0') != digits.charAt(12)) return false;

        int[] weights2 = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
        sum = 0;

        for (int i = 0; i < 13; i++) {
            sum += Character.getNumericValue(digits.charAt(i)) * weights2[i];
        }

        mod = sum % 11;

        if (mod == 0 || mod == 1) mod = 0;
        else mod = 11 - mod;

        return (char)(mod + '0') == digits.charAt(13);
    }

    private static boolean isAllSame(String s) {
        return !s.isEmpty() && s.matches("^(.)\\1*$");
    }
}
