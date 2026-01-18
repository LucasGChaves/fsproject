package com.accenture.fsproject.dto.company;

import com.accenture.fsproject.model.enums.FederativeUnit;

public record CompanySummaryDTO(
        String name,
        String cnpj,
        String cep,
        FederativeUnit uf
) {}
