package com.accenture.fsproject.service;

import com.accenture.fsproject.dto.cep.CepResponseDTO;
import com.accenture.fsproject.dto.company.CompanyCreateDTO;
import com.accenture.fsproject.dto.company.CompanyResponseDTO;
import com.accenture.fsproject.dto.company.CompanyResponseDetailsDTO;
import com.accenture.fsproject.dto.company.CompanyUpdateDTO;
import com.accenture.fsproject.exception.BusinessLogicException;
import com.accenture.fsproject.exception.ItemNotFoundException;
import com.accenture.fsproject.model.Company;
import com.accenture.fsproject.model.enums.FederativeUnit;
import com.accenture.fsproject.model.enums.SearchType;
import com.accenture.fsproject.repository.CompanyRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CompanyServiceTest {

    @InjectMocks
    private CompanyService companyService;

    @Mock
    private CompanyRepository companyRepository;

    @Mock
    private CepService cepService;

    @Test
    void shouldThrowExceptionWhenCompanyNotFound() {
        when(companyRepository.findById(0L)).thenReturn(Optional.empty());

        assertThrows(ItemNotFoundException.class, () -> companyService.findById(0L));
    }

    @Test
    void shouldThrowExceptionWhenCompanyAlreadyExists() {
        CompanyCreateDTO dto = new CompanyCreateDTO(
                "Company A",
                "53162442000109",
                "35604000",
                FederativeUnit.MG,
                Collections.emptySet()
        );

        when(companyRepository.existsByCnpj(dto.cnpj())).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> companyService.create(dto));
    }

    @Test
    void shouldThrowExceptionInvalidCnpj() {
        CompanyCreateDTO dto = new CompanyCreateDTO(
                "Company A",
                "53162442000108",
                "35604000",
                FederativeUnit.MG,
                Collections.emptySet()
        );

        when(companyRepository.existsByCnpj(dto.cnpj())).thenReturn(false);

        assertThrows(BusinessLogicException.class, () -> companyService.create(dto));
    }

    @Test
    void shouldReturnCompanyWhenFound() {
        Company company = new Company();
        company.setName("Company A");
        company.setCnpj("53162442000109");
        company.setCep("35604000");
        company.setUf(FederativeUnit.MG);

        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));

        CompanyResponseDetailsDTO response = companyService.findById(1L);

        assertNotNull(response);
        assertEquals("Company A", response.name());
        assertEquals("53162442000109", response.cnpj());
        assertEquals("35604000", response.cep());
        assertEquals(FederativeUnit.MG, response.uf());
    }

    @Test
    void shouldReturnNothingWhenSearchWithoutAnyMatch() {
        String query = "testing...";

        Pageable pageable = PageRequest.of(0, 5);
        Page<Company> page = Page.empty(pageable);

        when(companyRepository.findByNameOrCnpj(query, pageable)).thenReturn(page);

        Page<CompanyResponseDTO> result = companyService.search(query, SearchType.GENERAL, pageable);

        assertTrue(result.isEmpty());
        assertEquals(0, result.getTotalElements());
    }

    @Test
    void shouldReturnCompaniesWhenSearchWithMatches() {
        Company company = new Company();
        company.setId(1L);
        company.setName("Company A");

        Page<Company> page = new PageImpl<>(List.of(company));
        Pageable pageable = PageRequest.of(0, 5);

        when(companyRepository.findByNameOrCnpj(company.getName(), pageable)).thenReturn(page);

        Page<CompanyResponseDTO> result = companyService.search(company.getName(), SearchType.GENERAL, pageable);

        assertFalse(result.isEmpty());
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void shouldUpdateCompany() {
        Company company = new Company();
        company.setId(1L);
        company.setName("Company A");
        company.setCnpj("53162442000109");
        company.setCep("35604000");
        company.setUf(FederativeUnit.MG);
        company.setSuppliers(Collections.emptySet());

        CompanyUpdateDTO dto = new CompanyUpdateDTO(
                "Compania A",
                "35604000",
                FederativeUnit.MG,
                Collections.emptySet()
        );

        CepResponseDTO cepDto = new CepResponseDTO("MG", null);

        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));

        when(cepService.getCepInfo(dto.cep())).thenReturn(cepDto);

        CompanyResponseDetailsDTO response = companyService.update(1L, dto);

        assertEquals("Compania A", response.name());
    }

    @Test
    void shouldDeleteCompany() {
        when(companyRepository.existsById(1L)).thenReturn(true);

        companyService.delete(1L);

        verify(companyRepository).deleteById(1L);
    }

    @Test
    void shouldCreateCompany() {
        CompanyCreateDTO dto = new CompanyCreateDTO(
                "Company A",
                "53162442000109",
                "35604000",
                FederativeUnit.MG,
                Collections.emptySet()
        );

        when(companyRepository.existsByCnpj(dto.cnpj())).thenReturn(false);
        when(cepService.getCepInfo(dto.cep())).thenReturn(new CepResponseDTO("MG", null));
        when(companyRepository.save(any(Company.class)))
                .thenAnswer(i -> i.getArgument(0));

        CompanyResponseDetailsDTO response = companyService.create(dto);

        assertEquals("Company A", response.name());
    }

    @Test
    void shouldFindAll() {
        Company company = new Company();
        company.setId(1L);
        company.setName("Company A");

        Company otherCompany = new Company();
        otherCompany.setId(2L);
        otherCompany.setName("Company B");

        List<Company> companies = new ArrayList<>();
        companies.add(company);
        companies.add(otherCompany);

        Page<Company> page = new PageImpl<>(companies);
        Pageable pageable = PageRequest.of(0, 5);

        when(companyRepository.findAll(pageable)).thenReturn(page);

        Page<CompanyResponseDTO> result = companyService.findAll(pageable);

        assertFalse(result.isEmpty());
        assertEquals(2, result.getTotalElements());
    }

    @Test
    void shouldReturnNone() {
        Page<Company> page = Page.empty();
        Pageable pageable = PageRequest.of(0, 5);

        when(companyRepository.findAll(pageable)).thenReturn(page);

        Page<CompanyResponseDTO> result = companyService.findAll(pageable);

        assertTrue(result.isEmpty());
        assertEquals(0, result.getTotalElements());
    }
}