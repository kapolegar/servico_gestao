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
DB_PATH=./database/operadora.db
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
  "database": "connected"
}
```

## Endpoints da API

### Health Check
* `GET /health` - Verificar status do serviço

### Clientes
* `GET /gestao/clientes` - Listar todos os clientes
* `GET /gestao/clientes/:id` - Buscar cliente por ID
* `POST /gestao/clientes` - Criar novo cliente
* `PUT /gestao/clientes/:id` - Atualizar cliente
* `DELETE /gestao/clientes/:id` - Remover cliente

### Planos
* `GET /gestao/planos` - Listar todos os planos
* `GET /gestao/planos/:id` - Buscar plano por ID
* `POST /gestao/planos` - Criar novo plano
* `PUT /gestao/planos/:id` - Atualizar plano
* `PATCH /gestao/planos/:id/status` - Alterar status do plano (ativo/inativo)
* `DELETE /gestao/planos/:id` - Remover plano

### Contratos
* `GET /gestao/contratos` - Listar todos os contratos
* `GET /gestao/contratos/:id` - Buscar contrato por ID
* `GET /gestao/contratos/cliente/:clienteId` - Listar contratos de um cliente
* `POST /gestao/contratos` - Criar novo contrato
* `PUT /gestao/contratos/:id` - Atualizar contrato
* `PATCH /gestao/contratos/:id/status` - Alterar status do contrato
* `DELETE /gestao/contratos/:id` - Cancelar contrato

## Exemplos de Uso da API

### Criar Cliente
```bash
curl -X POST http://localhost:3000/gestao/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "cpf": "12345678901",
    "email": "joao@email.com",
    "telefone": "(11) 99999-9999"
  }'
```

### Criar Plano
```bash
curl -X POST http://localhost:3000/gestao/planos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Plano Premium",
    "descricao": "Plano com benefícios premium",
    "valor": 99.90,
    "tipo": "pos-pago",
    "franquiaDados": 20480,
    "franquiaVoz": 300
  }'
```

### Criar Contrato
```bash
curl -X POST http://localhost:3000/gestao/contratos \
  -H "Content-Type: application/json" \
  -d '{
    "clienteId": 1,
    "planoId": 1,
    "dataInicio": "2024-06-01",
    "dataVencimento": 15
  }'
```

### Alterar Status do Plano
```bash
curl -X PATCH http://localhost:3000/gestao/planos/1/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "inativo"
  }'
```

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
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: planos
```sql
CREATE TABLE planos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    valor DECIMAL(10,2) NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- 'pre-pago' ou 'pos-pago'
    franquia_dados INTEGER, -- em MB
    franquia_voz INTEGER, -- em minutos
    status VARCHAR(20) DEFAULT 'ativo',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: contratos
```sql
CREATE TABLE contratos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    plano_id INTEGER NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    data_vencimento INTEGER NOT NULL, -- dia do mês
    status VARCHAR(20) DEFAULT 'ativo',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (plano_id) REFERENCES planos(id)
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
2024-06-03 12:00:00 [INFO] Servidor iniciado na porta 3000
2024-06-03 12:01:00 [INFO] Cliente criado com ID: 1
2024-06-03 12:02:00 [ERROR] Erro ao buscar cliente: Cliente não encontrado
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Padrões de Commit
- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação
- `style:` formatação de código
- `refactor:` refatoração
- `test:` testes
- `chore:` tarefas de build/configuração

## Solução de Problemas

### Erro: "Database file not found"
```bash
# Recriar o banco de dados
npm run db:reset
npm run seed
```

### Erro: "Port 3000 already in use"
```bash
# Usar porta diferente
PORT=3001 npm run dev
```

### Erro: "Cannot find module"
```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Contato

Para dúvidas ou sugestões:
- Email: suporte@operadora.com
- GitHub Issues: [Link para o repositório]