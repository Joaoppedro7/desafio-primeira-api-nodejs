# 🎓 API de Gerenciamento de Cursos

Uma API RESTful desenvolvida em Node.js com Fastify para gerenciamento de cursos, construída como parte de um desafio de desenvolvimento.

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **TypeScript** - Linguagem de programação tipada
- **Fastify** - Framework web rápido e eficiente
- **Drizzle ORM** - ORM moderno para TypeScript
- **PostgreSQL** - Banco de dados relacional
- **Zod** - Validação de esquemas
- **Swagger/OpenAPI** - Documentação da API
- **Docker** - Containerização

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- Docker e Docker Compose
- npm ou yarn

## 🛠️ Instalação

1. **Clone o repositório**

   ```bash
   git clone <url-do-repositorio>
   cd nodejs
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   Crie um arquivo `.env` na raiz do projeto:

   ```env
   DATABASE_URL=postgresql://admin:admin@localhost:5432/desafio
   NODE_ENV=development
   ```

4. **Inicie o banco de dados**

   ```bash
   docker-compose up -d
   ```

5. **Execute as migrações**

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

6. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

## 🗄️ Estrutura do Banco de Dados

### Tabela: `courses`

- `id` (UUID) - Identificador único do curso
- `title` (TEXT) - Título do curso (único)
- `description` (TEXT) - Descrição do curso

### Tabela: `users`

- `id` (UUID) - Identificador único do usuário
- `name` (TEXT) - Nome do usuário
- `email` (TEXT) - Email do usuário (único)

## 📚 Endpoints da API

### Cursos

#### `POST /courses`

Cria um novo curso.

**Body:**

```json
{
  "title": "Nome do Curso"
}
```

**Resposta (201):**

```json
{
  "courseId": "uuid-do-curso"
}
```

#### `GET /courses`

Lista todos os cursos.

**Resposta (200):**

```json
{
  "courses": [
    {
      "id": "uuid",
      "title": "Nome do Curso",
      "description": "Descrição do curso"
    }
  ]
}
```

#### `GET /courses/:id`

Busca um curso específico por ID.

**Resposta (200):**

```json
{
  "course": {
    "id": "uuid",
    "title": "Nome do Curso",
    "description": "Descrição do curso"
  }
}
```

## 🔄 Fluxo da Aplicação

```mermaid
graph TD
    A[Cliente] --> B[Fastify Server]
    B --> C{Validação Zod}
    C -->|Sucesso| D[Controller/Route]
    C -->|Erro| E[Erro 400 - Dados Inválidos]
    D --> F[Drizzle ORM]
    F --> G[PostgreSQL Database]
    G --> H[Resposta JSON]
    H --> A

    subgraph "Endpoints Principais"
        I[POST /courses] --> J[Criar Curso]
        K[GET /courses] --> L[Listar Cursos]
        M[GET /courses/:id] --> N[Buscar Curso]
    end

    subgraph "Validações"
        O[Validação de Título]
        P[Validação de UUID]
        Q[Validação de Schema]
    end

    subgraph "Banco de Dados"
        R[Tabela: courses]
        S[Tabela: users]
    end

    J --> O
    L --> R
    N --> P
    F --> R
    F --> S
```

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo de desenvolvimento
- `npm run db:generate` - Gera as migrações do banco de dados
- `npm run db:migrate` - Executa as migrações no banco de dados
- `npm run db:studio` - Abre o Drizzle Studio para visualizar o banco

## 📖 Documentação da API

Quando o servidor estiver rodando em modo de desenvolvimento, você pode acessar:

- **Swagger UI**: `http://localhost:3333/docs`
- **API Reference**: Interface moderna para visualizar e testar os endpoints

## 🐳 Docker

O projeto inclui configuração Docker para o banco de dados PostgreSQL:

```bash
# Iniciar o banco de dados
docker-compose up -d

# Parar o banco de dados
docker-compose down
```

## 🔧 Configuração de Desenvolvimento

### Estrutura do Projeto

```
├── src/
│   ├── routes/          # Rotas da API
│   └── database/        # Configuração do banco de dados
├── drizzle/             # Migrações do banco
├── server.ts           # Arquivo principal do servidor
├── package.json        # Dependências e scripts
└── docker-compose.yml  # Configuração do Docker
```

### Logs

O servidor utiliza Pino para logging com formatação bonita em desenvolvimento.

## 🚀 Deploy

Para fazer deploy em produção:

1. Configure as variáveis de ambiente apropriadas
2. Execute as migrações do banco de dados
3. Inicie o servidor com `node server.ts`

## 📝 Licença

Este projeto está sob a licença ISC.

## 👨‍💻 Autor

Desenvolvido como parte de um desafio de Node.js.

---

**Nota**: Este é um projeto de demonstração/desafio. Para uso em produção, considere adicionar autenticação, validações mais robustas e testes automatizados.
