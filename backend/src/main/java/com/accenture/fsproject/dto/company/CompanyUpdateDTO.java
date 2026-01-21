package com.accenture.fsproject.dto.company;

import com.accenture.fsproject.model.enums.FederativeUnit;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.Set;

public record CompanyUpdateDTO(
        @NotBlank(message = "\"Name\" is required.")
        String name,

        @NotNull(message = "\"CEP\" is required.")
        @Pattern(regexp = "\\d{8}", message = "\"CEP\" must have 8 digits")
        String cep,

        @NotNull(message = "\"UF\" is required.")
        FederativeUnit uf,

        @Nullable
        Set<Long> suppliersIds
) {}
