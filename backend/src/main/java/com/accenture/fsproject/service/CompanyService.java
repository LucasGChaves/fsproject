package com.accenture.fsproject.service;

import com.accenture.fsproject.dto.company.CompanyCreateDTO;
import com.accenture.fsproject.dto.company.CompanyResponseDTO;
import com.accenture.fsproject.dto.company.CompanyResponseDetailsDTO;

import com.accenture.fsproject.dto.company.CompanyUpdateDTO;
import com.accenture.fsproject.dto.supplier.SupplierSummaryDTO;
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
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final SupplierRepository supplierRepository;

    private final CepService cepService;

    private CompanyResponseDTO toCompanyResponseDTO(Company company) {
        Set<Long> suppliersIds = company.getSuppliers()
                .stream()
                .map(Supplier::getId)
                .collect(Collectors.toSet());

        return new CompanyResponseDTO(
                company.getId(),
                company.getName(),
                company.getCnpj(),
                company.getCep(),
                company.getUf(),
                suppliersIds
        );
    }

    private CompanyResponseDetailsDTO toCompanyResponseDetailsDTO(Company company) {
        Set<SupplierSummaryDTO> suppliers = company.getSuppliers().stream().map(
                supplier -> new SupplierSummaryDTO(
                        supplier.getName(),
                        supplier.getType(),
                        supplier.getCpfCnpj(),
                        supplier.getRg(),
                        supplier.getBirthdate(),
                        supplier.getEmail(),
                        supplier.getCep(),
                        supplier.getUf()
                )
        ).collect(Collectors.toSet());

        return new CompanyResponseDetailsDTO(
                company.getId(),
                company.getName(),
                company.getCnpj(),
                company.getCep(),
                company.getUf(),
                suppliers
        );
    }

    private int getPfSupplierAge(LocalDate birthdate) {
        return Period.between(birthdate, LocalDate.now()).getYears();
    }

    private void validateParanaSupplierCondition(FederativeUnit uf, Set<Supplier> suppliers) {
        if (uf != FederativeUnit.PR) return;

        Set<Supplier> notValidSuppliers = suppliers.stream()
                .filter(supplier -> supplier.getType() == SupplierType.PF
                        && (getPfSupplierAge(supplier.getBirthdate()) < 18))
                .collect(Collectors.toSet());

        if (!notValidSuppliers.isEmpty()) {
            throw new BusinessLogicException("The following suppliers cannot be added due to PF supplier being underage: "
                    + notValidSuppliers);
        }
    }

    public CompanyResponseDetailsDTO create(CompanyCreateDTO dto) {

        if (companyRepository.existsByCnpj(dto.cnpj())) {
            throw new IllegalArgumentException("Company with this CNPJ already exists");
        }

        CpfCnpjValidator.valid(dto.cnpj());

        Company company = new Company();
        company.setName(dto.name());
        company.setCnpj(dto.cnpj());

        FederativeUnit uf = FederativeUnit.valueOf(cepService.getCepInfo(dto.cep()).uf());

        company.setCep(dto.cep());
        company.setUf(uf);

        if (dto.suppliersIds() != null && !dto.suppliersIds().isEmpty()) {
            Set<Supplier> suppliers = new HashSet<>(supplierRepository.findAllById(dto.suppliersIds()));

            validateParanaSupplierCondition(company.getUf(), suppliers);

            company.setSuppliers(suppliers);
        }

        Company saved = companyRepository.save(company);
        return toCompanyResponseDetailsDTO(saved);
    }

    @Transactional(readOnly = true)
    public Page<CompanyResponseDTO> findAll(Pageable pageable) {
        Page<Company> response = companyRepository.findAll(pageable);
        return response.map(this::toCompanyResponseDTO);
    }

    @Transactional(readOnly = true)
    public CompanyResponseDetailsDTO findById(Long id) {
        Company company = companyRepository.findById(id).orElseThrow(() -> new ItemNotFoundException("Company not found"));
        return toCompanyResponseDetailsDTO(company);
    }

    public CompanyResponseDetailsDTO update(Long id, CompanyUpdateDTO dto) {
        Company company = companyRepository.findById(id).orElseThrow(() -> new ItemNotFoundException("Company not found"));

        if (dto.name() != null) company.setName(dto.name());

        if (dto.cep() != null) {
            FederativeUnit uf = FederativeUnit.valueOf(cepService.getCepInfo(dto.cep()).uf());

            company.setCep(dto.cep());
            company.setUf(uf);
        }

        if (dto.suppliersIds() != null && !dto.suppliersIds().isEmpty()) {
            Set<Supplier> suppliers = new HashSet<>(supplierRepository.findAllById(dto.suppliersIds()));

            validateParanaSupplierCondition(company.getUf(), suppliers);

            company.getSuppliers().clear();
            company.setSuppliers(suppliers);
        }

        return toCompanyResponseDetailsDTO(company);
    }

    public void delete(Long id) {
        if (!companyRepository.existsById(id)) {
            throw new RuntimeException("Company not found");
        }

        companyRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Page<CompanyResponseDTO> search(String query, SearchType type, Pageable pageable) {
        Page<Company> result;

        if (query == null || query.isBlank()) {
            result = companyRepository.findAll(pageable);
        } else {
            switch (type) {
                case GENERAL -> result = companyRepository.findByNameOrCnpj(query, pageable);
                case NAME -> result = companyRepository.findByNameContainingIgnoreCase(query, pageable);
                case CPF_CNPJ -> result = companyRepository.findByCnpjContaining(query, pageable);
                default -> result = companyRepository.findAll(pageable);
            }
        }

        return result.map(this::toCompanyResponseDTO);
    }
}
