package com.accenture.fsproject.dto.supplier;

import com.accenture.fsproject.dto.company.CompanySummaryDTO;
import com.accenture.fsproject.model.enums.FederativeUnit;
import com.accenture.fsproject.model.enums.SupplierType;

import java.time.LocalDate;
import java.util.Set;

public record SupplierResponseDetailsDTO(
        Long id,
        String name,
        SupplierType type,
        String cpfCnpj,
        String rg,
        LocalDate birthdate,
        String email,
        String cep,
        FederativeUnit uf,
        Set<CompanySummaryDTO> companies
) {}
