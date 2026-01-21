package com.accenture.fsproject.service;

import com.accenture.fsproject.dto.company.CompanySummaryDTO;
import com.accenture.fsproject.dto.supplier.SupplierCreateDTO;
import com.accenture.fsproject.dto.supplier.SupplierResponseDTO;
import com.accenture.fsproject.dto.supplier.SupplierResponseDetailsDTO;
import com.accenture.fsproject.dto.supplier.SupplierUpdateDTO;
import com.accenture.fsproject.exception.BusinessLogicException;
import com.accenture.fsproject.exception.ItemNotFoundException;
import com.accenture.fsproject.model.Company;
import com.accenture.fsproject.model.Supplier;
import com.accenture.fsproject.model.enums.FederativeUnit;
import com.accenture.fsproject.model.enums.SearchType;
import com.accenture.fsproject.model.enums.SupplierType;
import com.accenture.fsproject.repository.CompanyRepository;
import com.accenture.fsproject.repository.SupplierRepository;
import com.accenture.fsproject.util.CpfCnpjValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final CompanyRepository companyRepository;

    private final CepService cepService;

    private SupplierResponseDTO toSupplierResponseDTO(Supplier supplier) {
        Set<Long> companiesIds = supplier.getCompanies().stream().map(Company::getId).collect(Collectors.toSet());

        return new SupplierResponseDTO(
                supplier.getId(),
                supplier.getName(),
                supplier.getType(),
                supplier.getCpfCnpj(),
                supplier.getRg(),
                supplier.getBirthdate(),
                supplier.getEmail(),
                supplier.getCep(),
                supplier.getUf(),
                companiesIds
        );
    }

    private SupplierResponseDetailsDTO toSupplierResponseDetailsDTO(Supplier supplier) {
        Set<CompanySummaryDTO> companies = supplier.getCompanies().stream().map(
                company -> new CompanySummaryDTO(
                        company.getName(),
                        company.getCnpj(),
                        company.getCep(),
                        company.getUf()
                )
        ).collect(Collectors.toSet());

        return new SupplierResponseDetailsDTO(
                supplier.getId(),
                supplier.getName(),
                supplier.getType(),
                supplier.getCpfCnpj(),
                supplier.getRg(),
                supplier.getBirthdate(),
                supplier.getEmail(),
                supplier.getCep(),
                supplier.getUf(),
                companies
        );
    }

    private void validatePfFields(SupplierCreateDTO dto) {
        if (dto.type() == SupplierType.PF) {
            if (dto.rg() == null || dto.birthdate() == null) {
                throw new BusinessLogicException("PF supplier should have both \"birthdate\" and \"rg\" filled.");
            }
        }
    }

    public SupplierResponseDetailsDTO create(SupplierCreateDTO dto) {

        if (supplierRepository.existsByCpfCnpj(dto.cpfCnpj())) {
            throw new IllegalArgumentException("Company with this CPF/CNPJ already exists.");
        }

        CpfCnpjValidator.valid(dto.cpfCnpj());

        validatePfFields(dto);

        Supplier supplier = new Supplier();
        supplier.setType(dto.type());
        supplier.setName(dto.name());
        supplier.setCpfCnpj(dto.cpfCnpj());
        supplier.setRg(dto.rg());
        supplier.setBirthdate(dto.birthdate());
        supplier.setEmail(dto.email());

        FederativeUnit uf = FederativeUnit.valueOf(cepService.getCepInfo(dto.cep()).uf());

        supplier.setCep(dto.cep());
        supplier.setUf(uf);

        if (dto.companiesIds() != null && !dto.companiesIds().isEmpty()) {
            Set<Company> companies = new HashSet<>(companyRepository.findAllById(dto.companiesIds()));

            supplier.setCompanies(companies);

            for (Company company : companies) {
                company.getSuppliers().add(supplier);
            }
        }

        Supplier saved = supplierRepository.save(supplier);
        return toSupplierResponseDetailsDTO(saved);
    }

    @Transactional(readOnly = true)
    public Page<SupplierResponseDTO> findAll(Pageable pageable) {
        Page<Supplier> response = supplierRepository.findAll(pageable);
        return response.map(this::toSupplierResponseDTO);
    }

    @Transactional(readOnly = true)
    public SupplierResponseDetailsDTO findById(Long id) {
        Supplier supplier =  supplierRepository
                .findById(id)
                .orElseThrow(() -> new ItemNotFoundException("Supplier not found"));

        return toSupplierResponseDetailsDTO(supplier);
    }

    public SupplierResponseDetailsDTO update(Long id, SupplierUpdateDTO dto) {
        Supplier supplier = supplierRepository
                .findById(id)
                .orElseThrow(() -> new ItemNotFoundException("Supplier not found"));

        if (dto.name() != null) supplier.setName(dto.name());
        if (dto.rg() != null) supplier.setRg(dto.rg());
        if (dto.birthdate() != null) supplier.setBirthdate(dto.birthdate());
        if (dto.email() != null) supplier.setEmail(dto.email());

        if (dto.cep() != null) {
            FederativeUnit uf = FederativeUnit.valueOf(cepService.getCepInfo(dto.cep()).uf());

            supplier.setCep(dto.cep());
            supplier.setUf(uf);
        }

        if (dto.companiesIds() != null && !dto.companiesIds().isEmpty()) {
            Set<Company> companies = new HashSet<>(companyRepository.findAllById(dto.companiesIds()));

            supplier.getCompanies().clear();
            supplier.setCompanies(companies);

            for (Company company : companies) {
                company.getSuppliers().add(supplier);
            }
        }

        return toSupplierResponseDetailsDTO(supplier);
    }

    public void delete(Long id) {
        if (!supplierRepository.existsById(id)) {
            throw new RuntimeException("Supplier not found");
        }

        supplierRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Page<SupplierResponseDTO> search(String query, SearchType type, Pageable pageable) {
        Page<Supplier> result;

        if (query == null || query.isBlank()) {
            result = supplierRepository.findAll(pageable);
        } else {
            switch (type) {
                case GENERAL -> result = supplierRepository.findByNameOrCpfCnpj(query, pageable);
                case NAME -> result = supplierRepository.findByNameContainingIgnoreCase(query, pageable);
                case CPF_CNPJ -> result = supplierRepository.findByCpfCnpjContaining(query, pageable);
                default -> result = supplierRepository.findAll(pageable);
            }
        }

        return result.map(this::toSupplierResponseDTO);
    }
}
