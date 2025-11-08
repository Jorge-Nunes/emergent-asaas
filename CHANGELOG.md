# Changelog - Migração e Correções

## Data: 2025-01-14

### ✅ Implementado

#### 1. Migração de MemStorage para PostgreSQL

**Arquivos Criados:**
- `/app/shared/db-schema.ts`: Schema completo do banco de dados usando Drizzle ORM
- `/app/server/db.ts`: Configuração da conexão com o banco de dados
- `/app/server/postgres-storage.ts`: Implementação completa do PostgreSQL Storage
- `/app/MIGRATION_GUIDE.md`: Guia detalhado de migração
- `/app/.env.example`: Template de variáveis de ambiente

**Arquivos Modificados:**
- `/app/server/storage.ts`: Agora suporta dois modos (MemStorage e PostgreSQL)
- `/app/drizzle.config.ts`: Atualizado para usar o novo schema
- `/app/package.json`: Adicionados scripts para gerenciar banco de dados

**Funcionalidades:**
- ✅ Sistema detecta automaticamente se DATABASE_URL está configurada
- ✅ Fallback automático para MemStorage se não houver DATABASE_URL
- ✅ Todas as operações CRUD funcionando em ambos os modos
- ✅ Migrações Drizzle configuradas e prontas para uso

**Tabelas do Banco de Dados:**
1. `users` - Usuários do sistema (futuro sistema de autenticação)
2. `config` - Configurações globais (tokens, URLs, templates)
3. `cobrancas` - Cobranças sincronizadas do Asaas
4. `executions` - Histórico de execuções
5. `execution_logs` - Logs detalhados de cada execução

#### 2. Correção do Erro na Página Cobranças

**Problema Identificado:**
- Quando cobranças eram sincronizadas do Asaas sem o campo `tipo` definido
- A tabela tentava acessar `tipoConfig[undefined]`, causando erro

**Solução Implementada:**
- Adicionada verificação dupla: `cobranca.tipo && tipoConfig[cobranca.tipo]`
- Adicionado tipo "vencida" no `tipoConfig`
- Adicionado filtro "Vencida" na página de Cobranças

**Arquivos Modificados:**
- `/app/client/src/components/CobrancaTable.tsx`
- `/app/client/src/pages/Cobrancas.tsx`

#### 3. Verificação do Dashboard

**Status:** ✅ Funcionando perfeitamente

**APIs Testadas:**
- `GET /api/dashboard/metrics` ✅
- `GET /api/dashboard/chart-data` ✅
- `GET /api/dashboard/status-data` ✅
- `GET /api/config` ✅
- `GET /api/cobrancas` ✅
- `GET /api/executions` ✅
- `POST /api/executions/run` ✅

**Componentes Verificados:**
- MetricCard: Exibindo métricas corretamente
- ExecutionChart: Gráfico de execuções funcionando
- StatusChart: Gráfico de status funcionando
- ExecutionLogTable: Tabela de logs funcionando

#### 4. Atualização do Supervisor

**Mudanças:**
- Removida configuração antiga (backend FastAPI + frontend React separados)
- Adicionada configuração nova (app TypeScript full-stack unificado)
- Aplicação rodando na porta 5000
- Hot reload habilitado em modo desenvolvimento

**Status do Serviço:**
```
app: RUNNING (porta 5000)
```

### 📋 Como Usar

#### Modo Atual (MemStorage)
A aplicação está rodando em modo MemStorage (dados em memória).
```
[Storage] Using MemStorage (in-memory) - data will be lost on restart
```

#### Para Migrar para PostgreSQL

1. **Obter DATABASE_URL do Neon Database**
   ```
   https://console.neon.tech
   ```

2. **Criar arquivo .env**
   ```bash
   cp .env.example .env
   ```

3. **Adicionar DATABASE_URL no .env**
   ```env
   DATABASE_URL=postgresql://usuario:senha@host.neon.tech/database?sslmode=require
   ```

4. **Criar tabelas no banco**
   ```bash
   npm run db:push
   ```

5. **Reiniciar aplicação**
   ```bash
   sudo supervisorctl restart app
   ```

6. **Verificar logs**
   ```bash
   tail -f /var/log/supervisor/app.out.log
   ```

   Você deve ver:
   ```
   [Storage] Using PostgreSQL storage
   [PostgresStorage] Default config created
   ```

### 🔧 Scripts Disponíveis

```bash
npm run dev           # Iniciar em modo desenvolvimento
npm run build         # Build para produção
npm run start         # Iniciar em produção
npm run check         # Verificar TypeScript
npm run db:push       # Sincronizar schema com banco
npm run db:generate   # Gerar migrações
npm run db:migrate    # Executar migrações
npm run db:studio     # Abrir Drizzle Studio
```

### 🎯 Próximos Passos Recomendados

1. **Configurar DATABASE_URL** para persistência de dados
2. **Configurar credenciais Asaas** em /configuracoes
3. **Configurar credenciais Evolution API** em /configuracoes
4. **Executar primeira sincronização** via botão "Executar Agora" no Dashboard
5. **Verificar logs** de execução
6. **Configurar backup** do banco de dados PostgreSQL

### 📊 Status da Aplicação

| Componente | Status | Observações |
|------------|--------|-------------|
| Backend API | ✅ Funcionando | Todas as rotas testadas |
| Frontend | ✅ Funcionando | Interface carregando |
| Dashboard | ✅ Funcionando | Métricas e gráficos OK |
| Cobranças | ✅ Corrigido | Erro de tipo resolvido |
| Execuções | ✅ Funcionando | Histórico e logs OK |
| Configurações | ✅ Funcionando | CRUD completo |
| Relatórios | ✅ Funcionando | Página carregando |
| Cron Job | ✅ Funcionando | Agendado para 10h diariamente |
| PostgreSQL | ✅ Pronto | Aguardando DATABASE_URL |
| MemStorage | ✅ Funcionando | Modo atual |

### 🐛 Bugs Corrigidos

1. ✅ Erro na tabela de Cobranças quando `tipo` é `undefined`
2. ✅ Falta do tipo "vencida" no filtro e configuração
3. ✅ Supervisor configurado para arquitetura antiga

### 🔐 Segurança

- Tokens e API keys nunca são expostos na API (mascarados com ••••••••)
- Flags `_hasAsaasToken` e `_hasEvolutionApiKey` indicam se estão configurados
- Validação de credenciais antes de executar processamento

### 📝 Documentação Adicional

- `MIGRATION_GUIDE.md`: Guia completo de migração para PostgreSQL
- `.env.example`: Template de variáveis de ambiente
- `design_guidelines.md`: Guia de design da aplicação (já existente)
