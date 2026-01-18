INSERT INTO company (name, cnpj, cep, uf)
    VALUES
        ('Company A', '90730183000193', '49042210', 'SE'),
        ('Company B', '61767128000170', '93893970', 'RS'),
        ('Company C', '20361127000143', '89053516', 'SC');

INSERT INTO supplier (name, pf_pj, cpf_cnpj, rg, birthdate, cep, uf)
    VALUES
        ('Supplier 1', 'PJ', '13284781000135', NULL, NULL, '22783230', 'RJ'),
        ('Supplier 2', 'PF', '06138164040', '264504586', '01/01/2010', '86709224', 'PR'),
        ('Supplier 3', 'PF', '61301162094', NULL, '01/01/1998', '86709224', 'PR'),
        ('Supplier 4', 'PF', '60312218028', '489791293', NULL, '86709224', 'PR'),
        ('Supplier 5', 'PF', '78649223095', NULL, NULL, '86709224', 'PR'),
        ('Supplier 6', 'PJ', '74375135000178', NULL, NULL, '76900471', 'RO');

INSERT INTO company_supplier (company_id, supplier_id)
    VALUES
        (
            (SELECT id FROM company WHERE cnpj = '90730183000193'),
            (SELECT id FROM supplier WHERE cpf_cnpj = '13284781000135')
        ),
        (
            (SELECT id FROM company WHERE cnpj = '90730183000193'),
            (SELECT id FROM supplier WHERE cpf_cnpj = '06138164040')
        ),
        (
            (SELECT id FROM company WHERE cnpj = '90730183000193'),
            (SELECT id FROM supplier WHERE cpf_cnpj = '74375135000178')
        ),
        (
            (SELECT id FROM company WHERE cnpj = '61767128000170'),
            (SELECT id FROM supplier WHERE cpf_cnpj = '13284781000135')
        );