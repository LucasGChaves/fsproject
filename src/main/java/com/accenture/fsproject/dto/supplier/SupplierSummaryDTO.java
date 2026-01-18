package com.accenture.fsproject.dto.supplier;

import com.accenture.fsproject.model.enums.FederativeUnit;
import com.accenture.fsproject.model.enums.SupplierType;

import java.time.LocalDate;

public record SupplierSummaryDTO(
        String name,
        SupplierType type,
        String cpfCnpj,
        String rg,
        LocalDate birthdate,
        String email,
        String cep,
        FederativeUnit uf
) {}