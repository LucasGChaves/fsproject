package com.accenture.fsproject.dto.cep;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.annotation.Nullable;

public record CepResponseDTO(
        @Nullable String uf,
        @Nullable @JsonProperty("erro") Boolean notFound
) {}
