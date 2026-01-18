package com.accenture.fsproject.model;

import com.accenture.fsproject.model.enums.FederativeUnit;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="company")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", unique = true, nullable = false)
    private String name;

    @Column(name = "cnpj", unique = true, nullable = false, length = 14)
    private String cnpj;

    @Column(name = "cep", nullable = false, length = 8)
    private String cep;

    @Enumerated(EnumType.STRING)
    @Column(name = "uf", nullable = false, length = 2)
    private FederativeUnit uf;

    @ManyToMany
    @JoinTable(
            name = "company_supplier",
            joinColumns = @JoinColumn(name = "company_id"),
            inverseJoinColumns = @JoinColumn(name = "supplier_id"))
    @ToString.Exclude
    private Set<Supplier> suppliers = new HashSet<>();
}
