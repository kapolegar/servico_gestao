// Estrutura de pastas para a Fase 2
sistema-controle-planos-fase2/
├── api-gateway/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── gestao.js
│   │   │   ├── faturamento.js
│   │   │   └── planosativos.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── rateLimit.js
│   │   │   └── errorHandler.js
│   │   ├── config/
│   │   │   └── services.js
│   │   └── app.js
│   ├── package.json
│   ├── .env
│   └── README.md
├── servico-gestao/ (já existente da Fase 1)
│   ├── src/
│   ├── package.json
│   └── ...
├── servico-faturamento/
│   ├── src/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── Pagamento.js
│   │   │   └── repositories/
│   │   │       └── PagamentoRepository.js
│   │   ├── application/
│   │   │   └── usecases/
│   │   │       └── RegistrarPagamento.js
│   │   ├── infrastructure/
│   │   │   ├── database/
│   │   │   │   └── database.js
│   │   │   ├── repositories/
│   │   │   │   └── PagamentoRepositoryImpl.js
│   │   │   └── messaging/
│   │   │       └── MessageBroker.js
│   │   ├── presentation/
│   │   │   ├── controllers/
│   │   │   │   └── PagamentoController.js
│   │   │   └── routes/
│   │   │       └── pagamentos.js
│   │   ├── main/
│   │   │   └── server.js
│   │   └── config/
│   │       └── container.js
│   ├── package.json
│   ├── .env
│   └── README.md
├── servico-planos-ativos/
│   ├── src/
│   │   ├── domain/
│   │   │   └── cache/
│   │   │       └── CacheManager.js
│   │   ├── application/
│   │   │   └── usecases/
│   │   │       └── VerificarPlanoAtivo.js
│   │   ├── infrastructure/
│   │   │   ├── cache/
│   │   │   │   └── InMemoryCache.js
│   │   │   ├── messaging/
│   │   │   │   └── MessageBroker.js
│   │   │   └── http/
│   │   │       └── HttpClient.js
│   │   ├── presentation/
│   │   │   ├── controllers/
│   │   │   │   └── PlanosAtivosController.js
│   │   │   └── routes/
│   │   │       └── planosativos.js
│   │   ├── main/
│   │   │   └── server.js
│   │   └── config/
│   │       └── container.js
│   ├── package.json
│   ├── .env
│   └── README.md
├── docker-compose.yml
├── postman/
│   └── Sistema_Controle_Planos_Fase2.postman_collection.json
├── docs/
│   └── Relatorio_Fase2.pdf
└── README.md