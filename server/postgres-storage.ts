import { eq, desc, and, gte } from 'drizzle-orm';
import { getDb, schema } from './db';
import type { Config, Cobranca, Execution, ExecutionLog, DashboardMetrics } from '@shared/schema';
import type { IStorage } from './storage';

const DEFAULT_MESSAGE_TEMPLATES = {
  venceHoje: `🚗💨 Olá, aqui é da *TEKSAT Rastreamento Veicular*!
Notamos que sua fatura vence *hoje* 📅.
Para evitar juros e manter seu rastreamento ativo, faça o pagamento o quanto antes.

🔗 Link da fatura: {{link_fatura}}
💰 Valor: {{valor}}
📆 Vencimento: {{vencimento}}

Qualquer dúvida, nossa equipe está à disposição! 🤝`,
  aviso: `🔔 Olá, tudo bem? Somos da *TEKSAT Rastreamento Veicular*.
Faltam apenas {{dias_aviso}} dia(s) para o vencimento da sua fatura 🗓️.
Evite a suspensão do serviço e mantenha sua proteção ativa! 🛡️

🔗 Link da fatura: {{link_fatura}}
💰 Valor: {{valor}}
🗓️ Vencimento: {{vencimento}}

Estamos aqui para ajudar no que precisar! 📞`,
  vencida: `⚠️ Atenção! Somos da *TEKSAT Rastreamento Veicular*.
Sua fatura está *vencida* desde {{vencimento}} 🚨.

Pedimos que regularize o pagamento para evitar interrupção no rastreamento 🚗📡.
Se já tiver efetuado o pagamento, por favor desconsidere esta mensagem.

🔗 Link da fatura: {{link_fatura}}
💰 Valor: {{valor}}
📆 Vencimento: {{vencimento}}

Conte conosco para qualquer dúvida! 🤝`,
};

export class PostgresStorage implements IStorage {
  private db = getDb();

  async initialize() {
    if (!this.db) {
      console.log('[PostgresStorage] Database not available, skipping initialization');
      return;
    }

    try {
      // Check if config exists, if not create default
      const configs = await this.db.select().from(schema.config).limit(1);
      
      if (configs.length === 0) {
        console.log('[PostgresStorage] Creating default config...');
        await this.db.insert(schema.config).values({
          asaasToken: process.env.ASAAS_TOKEN || '',
          asaasUrl: process.env.ASAAS_URL || 'https://api.asaas.com/v3',
          evolutionUrl: process.env.EVOLUTION_URL || '',
          evolutionInstance: process.env.EVOLUTION_INSTANCE || '',
          evolutionApiKey: process.env.EVOLUTION_APIKEY || '',
          diasAviso: 10,
          messageTemplateVenceHoje: DEFAULT_MESSAGE_TEMPLATES.venceHoje,
          messageTemplateAviso: DEFAULT_MESSAGE_TEMPLATES.aviso,
          messageTemplateVencida: DEFAULT_MESSAGE_TEMPLATES.vencida,
        });
        console.log('[PostgresStorage] Default config created');
      }
    } catch (error) {
      console.error('[PostgresStorage] Error initializing:', error);
    }
  }

  async getConfig(): Promise<Config> {
    if (!this.db) {
      return this.getDefaultConfig();
    }

    try {
      const configs = await this.db.select().from(schema.config).limit(1);
      
      if (configs.length === 0) {
        return this.getDefaultConfig();
      }

      const config = configs[0];
      return {
        asaasToken: config.asaasToken,
        asaasUrl: config.asaasUrl,
        evolutionUrl: config.evolutionUrl,
        evolutionInstance: config.evolutionInstance,
        evolutionApiKey: config.evolutionApiKey,
        diasAviso: config.diasAviso,
        messageTemplates: {
          venceHoje: config.messageTemplateVenceHoje,
          aviso: config.messageTemplateAviso,
          vencida: config.messageTemplateVencida,
        },
      };
    } catch (error) {
      console.error('[PostgresStorage] Error getting config:', error);
      return this.getDefaultConfig();
    }
  }

  private getDefaultConfig(): Config {
    return {
      asaasToken: process.env.ASAAS_TOKEN || '',
      asaasUrl: process.env.ASAAS_URL || 'https://api.asaas.com/v3',
      evolutionUrl: process.env.EVOLUTION_URL || '',
      evolutionInstance: process.env.EVOLUTION_INSTANCE || '',
      evolutionApiKey: process.env.EVOLUTION_APIKEY || '',
      diasAviso: 10,
      messageTemplates: DEFAULT_MESSAGE_TEMPLATES,
    };
  }

  async updateConfig(configData: Partial<Config>): Promise<Config> {
    if (!this.db) {
      throw new Error('Database not available');
    }

    try {
      const configs = await this.db.select().from(schema.config).limit(1);
      
      const updateData: any = {
        updatedAt: new Date(),
      };

      if (configData.asaasToken !== undefined) updateData.asaasToken = configData.asaasToken;
      if (configData.asaasUrl !== undefined) updateData.asaasUrl = configData.asaasUrl;
      if (configData.evolutionUrl !== undefined) updateData.evolutionUrl = configData.evolutionUrl;
      if (configData.evolutionInstance !== undefined) updateData.evolutionInstance = configData.evolutionInstance;
      if (configData.evolutionApiKey !== undefined) updateData.evolutionApiKey = configData.evolutionApiKey;
      if (configData.diasAviso !== undefined) updateData.diasAviso = configData.diasAviso;
      if (configData.messageTemplates?.venceHoje !== undefined) updateData.messageTemplateVenceHoje = configData.messageTemplates.venceHoje;
      if (configData.messageTemplates?.aviso !== undefined) updateData.messageTemplateAviso = configData.messageTemplates.aviso;
      if (configData.messageTemplates?.vencida !== undefined) updateData.messageTemplateVencida = configData.messageTemplates.vencida;

      if (configs.length === 0) {
        // Insert new config
        await this.db.insert(schema.config).values({
          ...updateData,
          asaasToken: configData.asaasToken || '',
          asaasUrl: configData.asaasUrl || 'https://api.asaas.com/v3',
          evolutionUrl: configData.evolutionUrl || '',
          evolutionInstance: configData.evolutionInstance || '',
          evolutionApiKey: configData.evolutionApiKey || '',
          diasAviso: configData.diasAviso || 10,
          messageTemplateVenceHoje: configData.messageTemplates?.venceHoje || DEFAULT_MESSAGE_TEMPLATES.venceHoje,
          messageTemplateAviso: configData.messageTemplates?.aviso || DEFAULT_MESSAGE_TEMPLATES.aviso,
          messageTemplateVencida: configData.messageTemplates?.vencida || DEFAULT_MESSAGE_TEMPLATES.vencida,
        });
      } else {
        // Update existing config
        await this.db.update(schema.config)
          .set(updateData)
          .where(eq(schema.config.id, configs[0].id));
      }

      return this.getConfig();
    } catch (error) {
      console.error('[PostgresStorage] Error updating config:', error);
      throw error;
    }
  }

  async getCobrancas(): Promise<Cobranca[]> {
    if (!this.db) {
      return [];
    }

    try {
      const results = await this.db.select().from(schema.cobrancas).orderBy(desc(schema.cobrancas.createdAt));
      
      return results.map(c => ({
        id: c.id,
        customer: c.customer,
        customerName: c.customerName,
        customerPhone: c.customerPhone,
        value: Number(c.value),
        dueDate: c.dueDate,
        status: c.status as any,
        invoiceUrl: c.invoiceUrl,
        description: c.description,
        tipo: c.tipo as any,
      }));
    } catch (error) {
      console.error('[PostgresStorage] Error getting cobrancas:', error);
      return [];
    }
  }

  async getCobrancaById(id: string): Promise<Cobranca | undefined> {
    if (!this.db) {
      return undefined;
    }

    try {
      const results = await this.db.select().from(schema.cobrancas).where(eq(schema.cobrancas.id, id)).limit(1);
      
      if (results.length === 0) return undefined;

      const c = results[0];
      return {
        id: c.id,
        customer: c.customer,
        customerName: c.customerName,
        customerPhone: c.customerPhone,
        value: Number(c.value),
        dueDate: c.dueDate,
        status: c.status as any,
        invoiceUrl: c.invoiceUrl,
        description: c.description,
        tipo: c.tipo as any,
      };
    } catch (error) {
      console.error('[PostgresStorage] Error getting cobranca by id:', error);
      return undefined;
    }
  }

  async saveCobrancas(cobrancasData: Cobranca[]): Promise<void> {
    if (!this.db) {
      return;
    }

    if (cobrancasData.length === 0) return;

    try {
      for (const cobranca of cobrancasData) {
        await this.db.insert(schema.cobrancas).values({
          id: cobranca.id,
          customer: cobranca.customer,
          customerName: cobranca.customerName,
          customerPhone: cobranca.customerPhone,
          value: cobranca.value.toString(),
          dueDate: cobranca.dueDate,
          status: cobranca.status,
          invoiceUrl: cobranca.invoiceUrl,
          description: cobranca.description || '',
          tipo: cobranca.tipo || null,
          updatedAt: new Date(),
        }).onConflictDoUpdate({
          target: schema.cobrancas.id,
          set: {
            customer: cobranca.customer,
            customerName: cobranca.customerName,
            customerPhone: cobranca.customerPhone,
            value: cobranca.value.toString(),
            dueDate: cobranca.dueDate,
            status: cobranca.status,
            invoiceUrl: cobranca.invoiceUrl,
            description: cobranca.description || '',
            tipo: cobranca.tipo || null,
            updatedAt: new Date(),
          },
        });
      }
    } catch (error) {
      console.error('[PostgresStorage] Error saving cobrancas:', error);
      throw error;
    }
  }

  async updateCobranca(id: string, data: Partial<Cobranca>): Promise<Cobranca | undefined> {
    if (!this.db) {
      return undefined;
    }

    try {
      const updateData: any = {
        updatedAt: new Date(),
      };

      if (data.customer !== undefined) updateData.customer = data.customer;
      if (data.customerName !== undefined) updateData.customerName = data.customerName;
      if (data.customerPhone !== undefined) updateData.customerPhone = data.customerPhone;
      if (data.value !== undefined) updateData.value = data.value.toString();
      if (data.dueDate !== undefined) updateData.dueDate = data.dueDate;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.invoiceUrl !== undefined) updateData.invoiceUrl = data.invoiceUrl;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.tipo !== undefined) updateData.tipo = data.tipo;

      await this.db.update(schema.cobrancas)
        .set(updateData)
        .where(eq(schema.cobrancas.id, id));

      return this.getCobrancaById(id);
    } catch (error) {
      console.error('[PostgresStorage] Error updating cobranca:', error);
      return undefined;
    }
  }

  async getExecutions(): Promise<Execution[]> {
    if (!this.db) {
      return [];
    }

    try {
      const results = await this.db.select().from(schema.executions).orderBy(desc(schema.executions.timestamp)).limit(50);
      
      const executions: Execution[] = [];
      for (const exec of results) {
        const logs = await this.getExecutionLogs(exec.id);
        executions.push({
          id: exec.id,
          timestamp: exec.timestamp.toISOString(),
          status: exec.status as any,
          cobrancasProcessadas: exec.cobrancasProcessadas,
          mensagensEnviadas: exec.mensagensEnviadas,
          erros: exec.erros,
          detalhes: logs,
        });
      }

      return executions;
    } catch (error) {
      console.error('[PostgresStorage] Error getting executions:', error);
      return [];
    }
  }

  async getExecutionById(id: string): Promise<Execution | undefined> {
    if (!this.db) {
      return undefined;
    }

    try {
      const results = await this.db.select().from(schema.executions).where(eq(schema.executions.id, id)).limit(1);
      
      if (results.length === 0) return undefined;

      const exec = results[0];
      const logs = await this.getExecutionLogs(id);

      return {
        id: exec.id,
        timestamp: exec.timestamp.toISOString(),
        status: exec.status as any,
        cobrancasProcessadas: exec.cobrancasProcessadas,
        mensagensEnviadas: exec.mensagensEnviadas,
        erros: exec.erros,
        detalhes: logs,
      };
    } catch (error) {
      console.error('[PostgresStorage] Error getting execution by id:', error);
      return undefined;
    }
  }

  async createExecution(execution: Omit<Execution, 'id'>): Promise<Execution> {
    if (!this.db) {
      throw new Error('Database not available');
    }

    try {
      const result = await this.db.insert(schema.executions).values({
        timestamp: new Date(execution.timestamp),
        status: execution.status,
        cobrancasProcessadas: execution.cobrancasProcessadas,
        mensagensEnviadas: execution.mensagensEnviadas,
        erros: execution.erros,
      }).returning();

      const exec = result[0];
      return {
        id: exec.id,
        timestamp: exec.timestamp.toISOString(),
        status: exec.status as any,
        cobrancasProcessadas: exec.cobrancasProcessadas,
        mensagensEnviadas: exec.mensagensEnviadas,
        erros: exec.erros,
        detalhes: [],
      };
    } catch (error) {
      console.error('[PostgresStorage] Error creating execution:', error);
      throw error;
    }
  }

  async updateExecution(id: string, data: Partial<Execution>): Promise<Execution | undefined> {
    if (!this.db) {
      return undefined;
    }

    try {
      const updateData: any = {};

      if (data.status !== undefined) updateData.status = data.status;
      if (data.cobrancasProcessadas !== undefined) updateData.cobrancasProcessadas = data.cobrancasProcessadas;
      if (data.mensagensEnviadas !== undefined) updateData.mensagensEnviadas = data.mensagensEnviadas;
      if (data.erros !== undefined) updateData.erros = data.erros;

      await this.db.update(schema.executions)
        .set(updateData)
        .where(eq(schema.executions.id, id));

      // Save logs if provided
      if (data.detalhes && data.detalhes.length > 0) {
        for (const log of data.detalhes) {
          await this.addExecutionLog({ ...log, executionId: id } as any);
        }
      }

      return this.getExecutionById(id);
    } catch (error) {
      console.error('[PostgresStorage] Error updating execution:', error);
      return undefined;
    }
  }

  async getExecutionLogs(executionId?: string): Promise<ExecutionLog[]> {
    if (!this.db) {
      return [];
    }

    try {
      const query = executionId
        ? this.db.select().from(schema.executionLogs).where(eq(schema.executionLogs.executionId, executionId))
        : this.db.select().from(schema.executionLogs).orderBy(desc(schema.executionLogs.timestamp)).limit(100);

      const results = await query;

      return results.map(log => ({
        id: log.id,
        cobrancaId: log.cobrancaId,
        customerName: log.customerName,
        customerPhone: log.customerPhone,
        tipo: log.tipo as any,
        status: log.status as any,
        mensagem: log.mensagem || undefined,
        erro: log.erro || undefined,
        timestamp: log.timestamp.toISOString(),
      }));
    } catch (error) {
      console.error('[PostgresStorage] Error getting execution logs:', error);
      return [];
    }
  }

  async addExecutionLog(log: Omit<ExecutionLog, 'id'> & { executionId: string }): Promise<ExecutionLog> {
    if (!this.db) {
      throw new Error('Database not available');
    }

    try {
      const result = await this.db.insert(schema.executionLogs).values({
        executionId: log.executionId,
        cobrancaId: log.cobrancaId,
        customerName: log.customerName,
        customerPhone: log.customerPhone,
        tipo: log.tipo,
        status: log.status,
        mensagem: log.mensagem || null,
        erro: log.erro || null,
        timestamp: new Date(log.timestamp),
      }).returning();

      const saved = result[0];
      return {
        id: saved.id,
        cobrancaId: saved.cobrancaId,
        customerName: saved.customerName,
        customerPhone: saved.customerPhone,
        tipo: saved.tipo as any,
        status: saved.status as any,
        mensagem: saved.mensagem || undefined,
        erro: saved.erro || undefined,
        timestamp: saved.timestamp.toISOString(),
      };
    } catch (error) {
      console.error('[PostgresStorage] Error adding execution log:', error);
      throw error;
    }
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    if (!this.db) {
      return {
        totalPendente: 0,
        venceHoje: 0,
        mensagensEnviadas: 0,
        taxaConversao: 0,
      };
    }

    try {
      const cobrancas = await this.getCobrancas();
      const pendentes = cobrancas.filter(c => c.status === 'PENDING');
      
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      const venceHoje = pendentes.filter(c => {
        const dueDate = new Date(c.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() === hoje.getTime();
      }).length;

      const totalPendente = pendentes.reduce((sum, c) => sum + c.value, 0);

      // Count messages sent in last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentLogs = await this.db.select()
        .from(schema.executionLogs)
        .where(
          and(
            gte(schema.executionLogs.timestamp, thirtyDaysAgo),
            eq(schema.executionLogs.status, 'success')
          )
        );

      const mensagensEnviadas = recentLogs.length;

      // Calculate conversion rate
      const recebidas = cobrancas.filter(c => 
        c.status === 'RECEIVED' || c.status === 'CONFIRMED'
      ).length;
      const total = cobrancas.length || 1;
      const taxaConversao = (recebidas / total) * 100;

      return {
        totalPendente,
        venceHoje,
        mensagensEnviadas,
        taxaConversao,
      };
    } catch (error) {
      console.error('[PostgresStorage] Error getting dashboard metrics:', error);
      return {
        totalPendente: 0,
        venceHoje: 0,
        mensagensEnviadas: 0,
        taxaConversao: 0,
      };
    }
  }
}
