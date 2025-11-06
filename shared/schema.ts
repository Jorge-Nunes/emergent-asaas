import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type Config = {
  asaasToken: string;
  asaasUrl: string;
  evolutionUrl: string;
  evolutionInstance: string;
  evolutionApiKey: string;
  diasAviso: number;
  messageTemplates: {
    venceHoje: string;
    aviso: string;
  };
};

export type Cliente = {
  id: string;
  name: string;
  email: string;
  phone: string;
  mobilePhone: string;
};

export type Cobranca = {
  id: string;
  customer: string;
  customerName: string;
  customerPhone: string;
  value: number;
  dueDate: string;
  status: 'PENDING' | 'RECEIVED' | 'CONFIRMED' | 'OVERDUE';
  invoiceUrl: string;
  description: string;
  tipo?: 'vence_hoje' | 'aviso' | 'processada';
};

export type Execution = {
  id: string;
  timestamp: string;
  status: 'running' | 'completed' | 'failed';
  cobrancasProcessadas: number;
  mensagensEnviadas: number;
  erros: number;
  detalhes: ExecutionLog[];
};

export type ExecutionLog = {
  id: string;
  cobrancaId: string;
  customerName: string;
  customerPhone: string;
  tipo: 'vence_hoje' | 'aviso';
  status: 'success' | 'error';
  mensagem?: string;
  erro?: string;
  timestamp: string;
};

export type DashboardMetrics = {
  totalPendente: number;
  venceHoje: number;
  mensagensEnviadas: number;
  taxaConversao: number;
};
