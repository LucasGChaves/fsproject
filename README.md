# FSProject
## Accenture Project for FullStack Position - Single-Page Application (SPA) to manage brazilian companies and suppliers

### Description

#### Stack
- **Backend**: Java SE 21 (JDK 21), Spring Boot 3, Flyway;
- **Database**: PostgreSQL;
- **Frontend**: Node.js, TypeScript, Angular 21, Tailwind CSS;
- **Automated unit tests and CI**: JUnit, Mockito, GitHub Actions.

#### Entities
1. Company
   - Name
   - CNPJ
   - CEP
   - UF
2. Supplier
   - Name
   - Type ('PF' or 'PJ')
   - CPF/CNPJ
   - RG
   - Birthdate
   - Email
   - CEP
   - UF

#### Business Logic
- A **company** can have multiple **suppliers**, and a **supplier** can be associated with multiple **companies** (**N:N relationship**);
- The **supplier's** fields **RG** and **Birthdate** are available and needed only if the supplier's **type** is **PF**;
- We can create (C), list (R), update (U) and delete (D) companies and suppliers;
- When creating or editing a company, we can add a new supplier to it;
- We can search for specific companies and suppliers through a filtered text search;
- We can visualize the suppliers associated to a company, or the companies associated with a supplier.
- When creating or editing either a company or a supplier, the field **UF** is automatically filled when the user inputs a valid **CEP** value.
- The **CFP/CNPJ** field is **not** editable after created.

#### Connection with extenal API:
- the API *ViaCep* (https://viacep.com.br/) is being consumed to validate and get info from CEP.

#### Database tables and fields
- Please consult the Flyway migrations files in order to see the postgreSQL tables and their fields. Path: `backend/src/main/resources/db/migration`.

___

## API documentation and Backend endpoints

**Base URL:** `http://localhost:8080/`

### Company Endpoints

| Method | Endpoint | Parameters | Returns |
|--------|----------|------------|---------|
| `GET` | `/` | - | None |
| `GET` | `/companies` | - | `id`, `name`, `cnpj`, `cep`, `uf`, `suppliers` |
| `GET` | `/companies/search` | Query: `query`, `type` | Page of: { `id`, `name`, `cnpj`, `cep`, `uf`, `suppliers` } |
| `GET` | `/companies/{id}` | Path: `id` | `id`, `name`, `cnpj`, `cep`, `uf`, `suppliers` |
| `POST` | `/companies` | Body: `name`, `cnpj`, `cep`, `uf`, `suppliersIds` (optional) | Object created: { `id`, `name`, `cnpj`, `cep`, `uf`, `suppliers` } |
| `PUT` | `/companies/{id}` | Path: `id`<br>Body: `name`, `cep`, `uf`, `suppliersIds` | Updated object: { `id`, `name`, `cnpj`, `cep`, `uf`, `suppliers` } |
| `DELETE` | `/companies/{id}` | Path: `id` | None |

### Supplier Endpoints

| Method | Endpoint | Parameters | Returns |
|--------|----------|------------|---------|
| `GET` | `/suppliers` | - | `id`, `name`, `type`, `cpfCnpj`, `rg`, `email`, `birthdate`, `cep`, `uf`, `companies` |
| `GET` | `/suppliers/search` | Query: `query`, `type` | Page of: { `id`, `name`, `type`, `cpfCnpj`, `rg`, `email`, `birthdate`, `cep`, `uf`, `companies` } |
| `GET` | `/suppliers/{id}` | Path: `id` | `id`, `name`, `type`, `cpfCnpj`, `rg`, `email`, `birthdate`, `cep`, `uf`, `companies` |
| `POST` | `/suppliers` | Body: `name`, `type`, `cpfCnpj`, `rg`, `email`, `birthdate`, `cep`, `uf`, `companies`(optional) | Object with created: { `id`, `name`, `type`, `cpfCnpj`, `rg`, `email`, `birthdate`, `cep`, `uf`, `companies` } |
| `PUT` | `/suppliers/{id}` | Path: `id`<br>Body: `name`, `rg`, `email`, `birthdate`, `cep`, `uf` | Updated object: { `id`, `name`, `type`, `cpfCnpj`, `rg`, `email`, `birthdate`, `cep`, `uf`, `companies` } |
| `DELETE` | `/suppliers/{id}` | Path: `id` | None |

### CEP Endpoint

| Method | Endpoint | Parameters | Returns |
|--------|----------|------------|---------|
| `GET` | `/cep/{cep}` | Path: `cep` | `String` with UF |

___

## How to run

### Softwares needed
- Java SE 21.0.9 (JDK 21)
- Spring Boot 3.5.9
- PostgreSQL 18.1
- pgAdmin 9.11
- Node.js 24.13.0
- Angular 21.1.0
- IntelliJ IDEA Community Edition 2025.2.6.1
- VS Code 1.108.1
- Operating System: Windows 10/11

### Database local connection
- Database name: `fsproject`
- Database username: `fsproject_user`
- Host: `localhost`
- Port: `5432`

### Backend
1. After cloning the repository, open it on IntelliJ, go to the `backend/src/main/java/com/accenture/fsproject/FsprojectApplication.java` file and click on the "run" button on the left of the main method. Similarly, you can also click on the "run" button at the top of the window, if the build `FsprojectApplication` is selected.

2. When the application start running, search for the port it's using (`Tomcat started on port...`). The default is: `http://localhost:8080/`.

### Frontend
1. After cloning the repository, open it on VS Code and go to the folder `frontend`.
2. If you do not have Angular installed, run `npm install -g @angular/cli`.
3. Install dependencies with `npm install`.
4. Start the application with `ng serve`.
5. When the application start running, search for the port it's using. The default is: `http://localhost:4200/`.

## Automated Unit Tests & Continuous Integration
You can view the automated tests runned on backend when news pushes were done.