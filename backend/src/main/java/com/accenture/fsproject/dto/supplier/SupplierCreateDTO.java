package com.accenture.fsproject.dto.supplier;

import com.accenture.fsproject.model.enums.FederativeUnit;
import com.accenture.fsproject.model.enums.SupplierType;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.Set;

public record SupplierCreateDTO(
        @NotBlank(message = "\"Name\" is required.")
        String name,

        @NotNull(message = "Supplier type is required")
        SupplierType type,

        @NotNull(message = "\"CPF/CNPJ\" is required.")
        @Size(min = 11, max = 14, message = "\"CPF/CNPJ\" must have either 11 or 14 digits.")
        String cpfCnpj,

        @Size(min=7, max = 11, message = "RG must have at least 7 digits, and at most 11 digits")
        String rg,

        @Past(message = "Birthdate must be in the past")
        @JsonFormat(pattern = "dd/MM/yyyy")
        LocalDate birthdate,

        @NotNull(message = "\"Email\" is required.")
        @Email(message = "Invalid email.")
        String email,

        @NotNull(message = "\"CEP\" is required.")
        @Pattern(regexp = "\\d{8}", message = "\"CEP\" must have 8 digits")
        String cep,

        @NotNull(message = "\"UF\" is required.")
        FederativeUnit uf,

        @Nullable
        Set<Long> companiesIds
) {}
