package com.accenture.fsproject.dto.company;

import com.accenture.fsproject.model.enums.FederativeUnit;

import java.util.Set;

public record CompanyResponseDTO(
        Long id,
        String name,
        String cnpj,
        String cep,
        FederativeUnit uf,
        Set<Long> suppliersIds
) {}