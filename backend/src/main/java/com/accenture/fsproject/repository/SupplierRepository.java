package com.accenture.fsproject.repository;

import com.accenture.fsproject.model.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    boolean existsByCpfCnpj(String cpfCnpj);
    Page<Supplier> findByNameContainingIgnoreCase(String name, Pageable pageable);
    Page<Supplier> findByCpfCnpjContaining(String cpfCnpj, Pageable pageable);

    @Query("SELECT s FROM Supplier s " +
            "WHERE (:keyword) IS NULL OR " +
                "LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
                "LOWER(s.cpfCnpj) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Supplier> findByNameOrCpfCnpj(@Param("keyword") String keyword,Pageable pageable);
}
