CREATE TABLE company (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255),
    cnpj VARCHAR(14) NOT NULL UNIQUE,
    cep VARCHAR(8) NOT NULL,
    uf VARCHAR(2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_company_cnpj ON company(cnpj);

CREATE TABLE supplier (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255),
    pf_pj VARCHAR(2) NOT NULL CHECK(pf_pj IN ('PF', 'PJ')),
    cpf_cnpj VARCHAR(14) NOT NULL UNIQUE,
    rg VARCHAR(11) UNIQUE,
    birthdate DATE,
    email VARCHAR(255),
    cep VARCHAR(8) NOT NULL,
    uf VARCHAR(2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_supplier_cnpjcpf ON supplier(cpf_cnpj);

CREATE TABLE company_supplier (
    company_id BIGINT NOT NULL,
    supplier_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (company_id, supplier_id),

    CONSTRAINT fk_company
        FOREIGN KEY (company_id)
        REFERENCES company(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_supplier
        FOREIGN KEY (supplier_id)
        REFERENCES supplier(id)
        ON DELETE CASCADE
);