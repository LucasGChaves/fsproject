package com.accenture.fsproject.controller;

import com.accenture.fsproject.dto.supplier.SupplierCreateDTO;
import com.accenture.fsproject.dto.supplier.SupplierResponseDTO;
import com.accenture.fsproject.dto.supplier.SupplierUpdateDTO;
import com.accenture.fsproject.model.enums.SearchType;
import com.accenture.fsproject.service.SupplierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    @GetMapping
    public ResponseEntity<Page<SupplierResponseDTO>> searchSuppliers(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "GENERAL")SearchType type,
            Pageable pageable) {
        return ResponseEntity.ok(supplierService.search(query, type, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupplierResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(supplierService.findById(id));
    }

    @PostMapping
    public ResponseEntity<SupplierResponseDTO> create(@Valid @RequestBody SupplierCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(supplierService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SupplierResponseDTO> update(@PathVariable Long id, @Valid @RequestBody SupplierUpdateDTO dto) {
        return ResponseEntity.ok(supplierService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        supplierService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
