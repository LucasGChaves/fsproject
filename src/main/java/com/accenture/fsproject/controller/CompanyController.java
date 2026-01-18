package com.accenture.fsproject.controller;

import com.accenture.fsproject.dto.company.CompanyCreateDTO;
import com.accenture.fsproject.dto.company.CompanyResponseDTO;
import com.accenture.fsproject.dto.company.CompanyUpdateDTO;
import com.accenture.fsproject.model.enums.SearchType;
import com.accenture.fsproject.service.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping
    public ResponseEntity<Page<CompanyResponseDTO>> searchSuppliers(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "GENERAL") SearchType type,
            Pageable pageable) {
        return ResponseEntity.ok(companyService.search(query, type, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(companyService.findById(id));
    }

    @PostMapping
    public ResponseEntity<CompanyResponseDTO> create(@Valid @RequestBody CompanyCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(companyService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CompanyResponseDTO> update(@PathVariable Long id, @Valid @RequestBody CompanyUpdateDTO dto) {
        return ResponseEntity.ok(companyService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        companyService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
