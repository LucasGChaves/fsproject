package com.accenture.fsproject.repository;

import com.accenture.fsproject.model.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    boolean existsByCnpj(String cnpj);
    Page<Company> findByNameContainingIgnoreCase(String name, Pageable pageable);
    Page<Company> findByCnpjContaining(String cnpj, Pageable pageable);

    @Query("SELECT c FROM Company c " +
            "WHERE :keyword IS NULL OR " +
            "LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "c.cnpj LIKE CONCAT('%', :keyword, '%')")
    Page<Company> findByNameOrCnpj(@Param("keyword") String keyword, Pageable pageable);
}
