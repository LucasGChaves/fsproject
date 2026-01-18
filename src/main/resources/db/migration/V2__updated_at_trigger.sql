CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_company_updated_at
BEFORE UPDATE ON company
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER update_company_updated_at
BEFORE UPDATE ON supplier
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();