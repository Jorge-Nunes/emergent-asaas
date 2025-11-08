# Guia de Migração para PostgreSQL

## Visão Geral

O sistema agora suporta **dois modos de armazenamento**:

1. **MemStorage (Padrão)**: Armazenamento em memória - dados são perdidos ao reiniciar
2. **PostgreSQL**: Armazenamento persistente usando Neon Database

## Como Migrar para PostgreSQL

### 1. Obter DATABASE_URL

Se você estiver usando Neon Database (recomendado):
1. Acesse [Neon Console](https://console.neon.tech)
2. Crie um novo projeto ou use um existente
3. Copie a Connection String (URL de conexão)

Formato da URL:
```
postgresql://[usuario]:[senha]@[host]/[database]?sslmode=require
```

### 2. Configurar Variável de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione sua DATABASE_URL:

```env
DATABASE_URL=postgresql://seu_usuario:sua_senha@seu_host.neon.tech/seu_database?sslmode=require
```

### 3. Executar Migração do Schema

Execute o comando para criar as tabelas no banco de dados:

```bash
npm run db:push
```

Ou, se preferir gerar arquivos de migração primeiro:

```bash
npm run db:generate
npm run db:migrate
```

### 4. Reiniciar a Aplicação

```bash
npm run dev
```

O sistema detectará automaticamente a presença da `DATABASE_URL` e usará PostgreSQL.

## Estrutura do Banco de Dados

### Tabelas Criadas

1. **users**: Usuários do sistema (preparado para autenticação futura)
2. **config**: Configurações do sistema (tokens, URLs, templates)
3. **cobrancas**: Cobranças sincronizadas do Asaas
4. **executions**: Histórico de execuções automáticas/manuais
5. **execution_logs**: Logs detalhados de cada execução

## Scripts Disponíveis

- `npm run db:push`: Sincroniza schema com o banco (development)
- `npm run db:generate`: Gera arquivos de migração
- `npm run db:migrate`: Executa migrações pendentes
- `npm run db:studio`: Abre Drizzle Studio para visualizar dados

## Verificação

Após migrar, você verá no console:

```
[Storage] Using PostgreSQL storage
[PostgresStorage] Default config created
```

Se não houver DATABASE_URL configurada:

```
[Storage] Using MemStorage (in-memory) - data will be lost on restart
[Storage] Set DATABASE_URL environment variable to use PostgreSQL
```

## Benefícios da Migração

✅ **Persistência**: Dados não são perdidos ao reiniciar
✅ **Escalabilidade**: Suporta grandes volumes de cobranças
✅ **Histórico completo**: Todas as execuções e logs são mantidos
✅ **Backup**: Dados protegidos pelo Neon Database
✅ **Performance**: Queries otimizadas com índices

## Troubleshooting

### Erro: "DATABASE_URL not set"
- Verifique se o arquivo `.env` existe na raiz do projeto
- Confirme que a variável DATABASE_URL está definida corretamente

### Erro de Conexão
- Verifique se a URL está correta
- Confirme que o banco de dados está acessível
- Verifique as credenciais de acesso

### Dados não aparecem
- Execute `npm run db:push` para criar as tabelas
- Verifique os logs do servidor para erros
- Execute "Executar Agora" no Dashboard para sincronizar cobranças

## Rollback para MemStorage

Se precisar voltar para o modo memória:

1. Remova ou comente DATABASE_URL do arquivo `.env`
2. Reinicie a aplicação

```bash
npm run dev
```
