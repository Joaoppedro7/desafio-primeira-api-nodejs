# 🎓 API de Gerenciamento de Cursos

Uma API RESTful em Node.js + Fastify para gerenciamento de cursos, usando TypeScript, Drizzle ORM (PostgreSQL) e autenticação via JWT.

## 🚀 Tecnologias

- **Node.js** (TypeScript)
- **Fastify** + `fastify-type-provider-zod`
- **Zod** (validação)
- **Drizzle ORM** (PostgreSQL)
- **JWT** (autenticação)
- **Vitest** + `@vitest/coverage-v8`
- **Docker** (PostgreSQL)

## ✅ Requisitos

- Node.js 18+
- Docker e Docker Compose (para banco de dados)
- npm

## ⚙️ Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as chaves abaixo:

```env
# URL de conexão com o Postgres (ajuste conforme necessário)
DATABASE_URL=postgres://admin:admin@localhost:5432/desafio

# Ambiente: development | test | production
NODE_ENV=development

# Segredo usado para assinar/verificar JWT (obrigatório)
JWT_SECRET=uma_chave_segura_aqui
```

Para testes, opcionalmente crie um `.env.test` (ex.: apontando para outro banco/container):

```env
DATABASE_URL=postgres://admin:admin@localhost:5433/desafio_test
NODE_ENV=test
JWT_SECRET=test_secret
```

## 🐳 Banco de dados com Docker

Suba um Postgres local com Docker Compose (usa `docker/setup.sql` para seed inicial do DB):

```bash
docker-compose up -d
# Para parar/remover:
# docker-compose down
```

- Host: `localhost`
- Porta: `5432`
- DB: `desafio`
- User/Password: `admin` / `admin`

## 📦 Instalação

```bash
npm install
```

## 🧭 Migrações e seed

- Gerar migrações a partir do schema:

```bash
npm run db:generate
```

- Executar migrações no banco:

```bash
npm run db:migrate
```

- Rodar seed de dados (script local em `src/database/seed.ts`):

```bash
npm run db:seed
```

- Visualizar o banco com Drizzle Studio:

```bash
npm run db:studio
```

## ▶️ Executar em desenvolvimento

```bash
npm run dev
```

O servidor iniciará em `http://localhost:3333`.

- Documentação interativa: `http://localhost:3333/docs` (apenas em `NODE_ENV=development`).

## 🧪 Testes e cobertura

- Rodar testes:

```bash
npm test
```

- Assistir testes (com cobertura em HTML):

```bash
npm run test:watch
```

- Cobertura (gera `coverage/`):

```bash
npm run coverage
npm run coverage:open
```

Obs.: a config de cobertura e exclusões está em `vitest.config.ts`.

## 🔐 Autenticação e autorização

- Autenticação via JWT.
- Após login, envie o token no cabeçalho `Authorization` exatamente como retornado (sem prefixo `Bearer`).
- Permissões por papel (role): `student` e `manager`.
  - Algumas rotas exigem `manager`.

Cabeçalho de autenticação:

```http
Authorization: <token_jwt>
```

Erros comuns:

- `401 Unauthorized`: token ausente/inválido.
- `400 Invalid credentials`: e-mail ou senha inválidos no login.

## 📚 Endpoints

Base URL: `http://localhost:3333`

### Autenticação

- POST `/sessions` — Login
  - Body:

```json
{
  "email": "manager@example.com",
  "password": "senha"
}
```

- Resposta 200:

```json
{ "token": "<jwt>" }
```

### Cursos

- POST `/courses` — Criar curso (requer JWT com role `manager`)
  - Body:

```json
{ "title": "Nome do Curso" }
```

- Resposta 201:

```json
{ "courseId": "uuid" }
```

- GET `/courses` — Listar cursos (requer JWT e role `manager`)
  - Query params opcionais: `search`, `orderBy` (`title` | `id`), `page` (padrão 1)
  - Resposta 200:

```json
{
  "courses": [{ "id": "uuid", "title": "Nome", "enrollments": 0 }],
  "total": 1
}
```

- GET `/courses/:id` — Buscar curso (requer JWT)
  - Resposta 200:

```json
{
  "course": { "id": "uuid", "title": "Nome", "description": null }
}
```

- Resposta 404: `null`

## 🗂️ Estrutura do projeto (principal)

```
src/
  app.ts              # Configuração do Fastify, plugins e rotas
  server.ts           # Bootstrap do servidor (porta 3333)
  routes/
    login.ts
    create-course.ts
    get-courses.ts
    get-course-by-id.ts
    hooks/
      check-request-jwt.ts
      check-user-role.ts
  database/
    client.ts         # Conexão Drizzle com Postgres
    schema.ts         # Tabelas (users, courses, enrollments)
    seed.ts
  utils/
    get-authenticated-user-from-request.ts
```

Há arquivos de testes em `src/routes/*.test.ts` e helpers em `src/tests/factories`.

## 🧰 Scripts úteis

- `npm run dev` — servidor em desenvolvimento
- `npm run db:generate` — gerar migrações
- `npm run db:migrate` — executar migrações
- `npm run db:studio` — abrir Drizzle Studio
- `npm run db:seed` — rodar seed
- `npm test` — testes
- `npm run coverage` — relatório de cobertura
- `npm run coverage:open` — abrir relatório de cobertura

## 📎 Dicas

- O arquivo `requisicoes.http` contém exemplos para usar no VS Code (extensão REST Client) ou Cursor.
- O log em desenvolvimento usa `pino-pretty` para saída formatada.

## 🗺️ Diagrama do fluxo principal

```mermaid
graph TD
  A[Cliente] -->|1. POST /sessions| B[Login Controller]
  B --> C[Drizzle ORM]
  C --> D[(PostgreSQL)]
  B -->|Assina com JWT_SECRET| E[Emite JWT]
  E --> A

  A -->|2. Authorization: <token>| F[Fastify]
  F --> G[check-request-jwt]
  G --> H{Token válido?}
  H -- Não --> X[401 Unauthorized]
  H -- Sim --> ["check-user-role (quando exigido)"]
  I --> J{Tem permissão?}
  J -- Não --> Y[401 Unauthorized]
  J -- Sim --> K[Controller da Rota]
  K --> L[Drizzle ORM]
  L --> D
  D --> M[Resposta JSON 2xx/4xx]
  M --> A
```

## 📝 Licença

ISC.

## 👤 Autor

Projeto desenvolvido como parte de um desafio de Node.js.
