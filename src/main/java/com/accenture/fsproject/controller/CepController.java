package com.accenture.fsproject.controller;

import com.accenture.fsproject.dto.cep.CepResponseDTO;
import com.accenture.fsproject.service.CepService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/cep")
@RequiredArgsConstructor
public class CepController {

    private final CepService cepService;

    @GetMapping("/{cep}")
    public ResponseEntity<CepResponseDTO> getFederativeUnit(@PathVariable String cep) {
        return ResponseEntity.ok(cepService.getCepInfo(cep));
    }
}
