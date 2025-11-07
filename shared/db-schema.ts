import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal, integer, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Config table
export const config = pgTable("config", {
  id: uuid("id").primaryKey().defaultRandom(),
  asaasToken: text("asaas_token").notNull().default(''),
  asaasUrl: text("asaas_url").notNull().default('https://api.asaas.com/v3'),
  evolutionUrl: text("evolution_url").notNull().default(''),
  evolutionInstance: text("evolution_instance").notNull().default(''),
  evolutionApiKey: text("evolution_api_key").notNull().default(''),
  diasAviso: integer("dias_aviso").notNull().default(10),
  messageTemplateVenceHoje: text("message_template_vence_hoje").notNull(),
  messageTemplateAviso: text("message_template_aviso").notNull(),
  messageTemplateVencida: text("message_template_vencida").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Cobranças table
export const cobrancas = pgTable("cobrancas", {
  id: varchar("id", { length: 255 }).primaryKey(),
  customer: varchar("customer", { length: 255 }).notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  dueDate: varchar("due_date", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  invoiceUrl: text("invoice_url").notNull(),
  description: text("description").notNull().default(''),
  tipo: varchar("tipo", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Executions table
export const executions = pgTable("executions", {
  id: uuid("id").primaryKey().defaultRandom(),
  timestamp: timestamp("timestamp").notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  cobrancasProcessadas: integer("cobrancas_processadas").notNull().default(0),
  mensagensEnviadas: integer("mensagens_enviadas").notNull().default(0),
  erros: integer("erros").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Execution logs table
export const executionLogs = pgTable("execution_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  executionId: uuid("execution_id").notNull().references(() => executions.id, { onDelete: 'cascade' }),
  cobrancaId: varchar("cobranca_id", { length: 255 }).notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
  tipo: varchar("tipo", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  mensagem: text("mensagem"),
  erro: text("erro"),
  timestamp: timestamp("timestamp").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
