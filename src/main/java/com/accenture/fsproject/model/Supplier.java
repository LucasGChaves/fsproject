package com.accenture.fsproject.model;

import com.accenture.fsproject.model.enums.FederativeUnit;
import com.accenture.fsproject.model.enums.SupplierType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="supplier")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", unique = true, nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "pf_pj", nullable = false)
    private SupplierType type;

    @Column(name = "cpf_cnpj", unique = true, nullable = false, length = 14)
    private String cpfCnpj;

    @ToString.Exclude
    @Column(name = "rg", unique = true, length = 11)
    private String rg;

    @ToString.Exclude
    @Column(name = "birthdate")
    private LocalDate birthdate;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "cep", nullable = false, length = 8)
    private String cep;

    @Enumerated(EnumType.STRING)
    @Column(name = "uf", nullable = false, length = 2)
    private FederativeUnit uf;

    @ManyToMany(mappedBy = "suppliers")
    @ToString.Exclude
    private Set<Company> companies = new HashSet<>();
}
