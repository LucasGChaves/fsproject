package com.accenture.fsproject.service;

import com.accenture.fsproject.dto.cep.CepResponseDTO;
import com.accenture.fsproject.exception.BusinessLogicException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class CepService {

    private final RestClient restClient;

    public CepService(RestClient cepRestClient) {
        this.restClient = cepRestClient;
    }

    public CepResponseDTO getCepInfo(String cep) {
        String normalizedCep = normalizeCep(cep);

        CepResponseDTO response;

        try {
            response = this.restClient
                    .get()
                    .uri("/" + normalizedCep + "/json")
                    .retrieve()
                    .body(CepResponseDTO.class);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }

        if (response == null || response.uf() == null || Boolean.TRUE.equals(response.notFound())) {
            throw new IllegalArgumentException("Invalid CEP.");
        }

        return response;
    }

    private String normalizeCep(String cep) {
        if (cep == null) {
            throw new BusinessLogicException("CEP cannot be null.");
        }

        String onlyNumbers = cep.replaceAll("\\D", "");

        if (onlyNumbers.length() != 8) {
            throw new IllegalArgumentException("CEP must contain exactly 8 digits");
        }

        return onlyNumbers;
    }
}
