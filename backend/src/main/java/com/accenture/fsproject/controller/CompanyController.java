package com.accenture.fsproject.controller;

import com.accenture.fsproject.dto.company.CompanyCreateDTO;
import com.accenture.fsproject.dto.company.CompanyResponseDTO;
import com.accenture.fsproject.dto.company.CompanyResponseDetailsDTO;
import com.accenture.fsproject.dto.company.CompanyUpdateDTO;
import com.accenture.fsproject.model.enums.SearchType;
import com.accenture.fsproject.service.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping
    public ResponseEntity<Page<CompanyResponseDTO>> findAll(@PageableDefault(size=5, page=0) Pageable pageable) {
        return ResponseEntity.ok(companyService.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyResponseDetailsDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(companyService.findById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<CompanyResponseDTO>> searchCompanies(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "GENERAL") SearchType type,
            @PageableDefault(size=5, page=0) Pageable pageable) {
        return ResponseEntity.ok(companyService.search(query, type, pageable));
    }

    @PostMapping
    public ResponseEntity<CompanyResponseDetailsDTO> create(@Valid @RequestBody CompanyCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(companyService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CompanyResponseDetailsDTO> update(@PathVariable Long id, @Valid @RequestBody CompanyUpdateDTO dto) {
        return ResponseEntity.ok(companyService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        companyService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
