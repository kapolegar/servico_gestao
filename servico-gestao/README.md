# Sistema de Controle de Planos de Operadora - ServicoGestao

## Descrição
Este projeto implementa o **ServicoGestao**, o serviço principal do Sistema de Controle de Planos de Operadora, seguindo os princípios da **Arquitetura Limpa** (Clean Architecture) proposta por Robert Martin.

## Tecnologias Utilizadas
* **Node.js** (v16 ou superior)
* **Express.js** - Framework web
* **SQLite3** - Banco de dados
* **Jest** - Testes unitários
* **Nodemon** - Desenvolvimento (hot reload)

## Arquitetura
O projeto segue a Arquitetura Limpa com as seguintes camadas:

```
src/
├── domain/                 # Camada de Domínio
│   ├── entities/          # Entidades de negócio
│   └── repositories/      # Interfaces dos repositórios
├── application/           # Camada de Aplicação
│   └── usecases/         # Casos de uso
├── infrastructure/        # Camada de Infraestrutura
│   ├── database/         # Configuração e acesso ao banco
│   ├── repositories/     # Implementação dos repositórios
│   └── config/           # Configurações e injeção de dependência
├── presentation/          # Camada de Apresentação
│   ├── controllers/      # Controladores HTTP
│   └── routes/           # Definição das rotas
└── main/                 # Ponto de entrada da aplicação
    └── server.js         # Servidor principal
```

## Princípios SOLID Aplicados

### 1. Single Responsibility Principle (SRP)
* Cada classe tem uma única responsabilidade
* Casos de uso específicos para cada operação
* Controladores focados apenas na apresentação

### 2. Open/Closed Principle (OCP)
* Interfaces de repositórios permitem extensão sem modificação
* Novos casos de uso podem ser adicionados sem alterar existentes

### 3. Liskov Substitution Principle (LSP)
* Implementações de repositórios são intercambiáveis
* Diferentes bases de dados podem ser usadas sem alteração no código

### 4. Interface Segregation Principle (ISP)
* Interfaces específicas para cada repositório
* Casos de uso dependem apenas das interfaces necessárias

### 5. Dependency Inversion Principle (DIP)
* Camadas superiores não dependem de implementações concretas
* Injeção de dependência centralizada

## Padrões de Projeto Utilizados

### 1. Repository Pattern
* Abstração do acesso a dados
* Interfaces na camada de domínio, implementações na infraestrutura

### 2. Dependency Injection
* Container de dependências centralizado
* Baixo acoplamento entre componentes

### 3. Use Case Pattern
* Casos de uso encapsulam regras de negócio
* Interface clara entre apresentação e domínio

### 4. Factory Pattern
* Criação de entidades através de métodos estáticos
* Validação e inicialização consistente

## Instalação e Execução

### Pré-requisitos
* Node.js v16 ou superior
* npm ou yarn
* Banco de dados SQLite3

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente
Copie o arquivo `.env.example` para `.env` (se necessário, ajuste as configurações)

```bash
cp .env.example .env
```

Exemplo de configuração `.env`:
```env
# Configurações do servidor
PORT=3000
NODE_ENV=development

# Configurações do banco de dados
DB_PATH=./database/sistema_planos.db
DB_TYPE=sqlite

# Configurações de logging
LOG_LEVEL=info
```

### 3. Inicializar banco de dados com dados de teste

```bash
npm run seed
```

### 4. Executar a aplicação

#### Modo desenvolvimento (com hot reload)
```bash
npm run dev
```

#### Modo produção
```bash
npm start
```

### 5. Verificar se está funcionando
Acesse: `http://localhost:3000/health`

Resposta esperada:
```json
{
  "status": "OK",
  "service": "ServicoGestao",
  "timestamp": "2024-06-03T12:00:00.000Z",
}
```

## Endpoints da API

### Health Check
* `GET /health` - Verificar status do serviço

### Clientes
* `GET /gestao/clientes` - Listar todos os clientes

### Planos
* `GET /gestao/planos` - Listar todos os planos
* `GET /gestao/planos/:idPlano` - Buscar plano por ID

### Assinaturas
* `GET /gestao/assinaturas` - Listar todas as assinaturas
* `GET /assinaturas/:tipo` - Retorna a lista com todas as assinaturas de um determinado tipo [TODOS|ATIVOS|CANCELADOS]
* `GET /gestao/assinaturascliente/:codcli` - Retorna a lista das assinaturas do cliente informado
* `POST /gestao/assinaturasplano/:codplano` - Retorna a lista de assinaturas de um plano

## Scripts Disponíveis

```bash
# Desenvolvimento com hot reload
npm run dev

# Execução em produção
npm start

# Executar testes
npm test

# Executar testes com watch
npm run test:watch

# Executar testes com coverage
npm run test:coverage

# Seed do banco de dados
npm run seed

# Reset do banco de dados
npm run db:reset

# Linting do código
npm run lint

# Formatação do código
npm run format
```

## Estrutura do Banco de Dados

### Tabela: clientes
```sql
CREATE TABLE clientes (
    codigo INTEGER PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);
```

### Tabela: planos
```sql
CREATE TABLE planos (
    codigo INTEGER PRIMARY KEY,
    nome TEXT NOT NULL,
    custo_mensal REAL NOT NULL,
    data TEXT NOT NULL,
    descricao TEXT
);
```

### Tabela: assinaturas
```sql
CREATE TABLE assinaturas (
    codigo INTEGER PRIMARY KEY,
    cod_plano INTEGER NOT NULL,
    cod_cli INTEGER NOT NULL,
    inicio_fidelidade TEXT NOT NULL,
    fim_fidelidade TEXT NOT NULL,
    data_ultimo_pagamento TEXT,
    custo_final REAL NOT NULL,
    descricao TEXT,
    FOREIGN KEY (cod_plano) REFERENCES planos (codigo),
    FOREIGN KEY (cod_cli) REFERENCES clientes (codigo)
);
```

## Testes

### Executar todos os testes
```bash
npm test
```

### Executar testes em modo watch
```bash
npm run test:watch
```

### Gerar relatório de cobertura
```bash
npm run test:coverage
```

### Estrutura de testes
```
tests/
├── unit/                  # Testes unitários
│   ├── domain/           # Testes das entidades
│   ├── application/      # Testes dos casos de uso
│   └── infrastructure/   # Testes dos repositórios
├── integration/          # Testes de integração
│   └── api/             # Testes dos endpoints
└── fixtures/            # Dados de teste
    └── testData.js
```

## Logging

O sistema utiliza diferentes níveis de log:
- **error**: Erros críticos
- **warn**: Avisos importantes
- **info**: Informações gerais
- **debug**: Informações de debug

### Exemplo de logs
```
2024-06-03 12:00:00 [INFO] Servidor rodando na porta 3000
2024-06-03 12:01:00 [ERROR] Erro ao listar planos: 2000
2024-06-03 12:02:00 [ERROR] Recurso não encontrado
```
