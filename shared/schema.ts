import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const jafrAnalyses = pgTable("jafr_analyses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  mother: text("mother").notNull(),
  question: text("question").notNull(),
  totalValue: integer("total_value").notNull(),
  reducedValue: integer("reduced_value").notNull(),
  wafqSize: integer("wafq_size").notNull(),
  nameAnalysis: jsonb("name_analysis").notNull(),
  motherAnalysis: jsonb("mother_analysis").notNull(),
  questionAnalysis: jsonb("question_analysis").notNull(),
  traditionalResults: jsonb("traditional_results").notNull(),
  aiAnalysis: jsonb("ai_analysis"),
  combinedInterpretation: text("combined_interpretation"),
  aiEnabled: boolean("ai_enabled").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const jafrAnalysisRequestSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  mother: z.string().min(1, "اسم الأم مطلوب"),
  question: z.string().min(10, "السؤال يجب أن يكون أكثر تفصيلاً"),
  options: z.object({
    deepAnalysis: z.boolean().default(true),
    numerologyDetails: z.boolean().default(true),
    contextualInterpretation: z.boolean().default(true),
  }).optional(),
});

export const numerologyAnalysisSchema = z.object({
  total: z.number(),
  details: z.array(z.object({
    char: z.string(),
    value: z.number(),
  })),
});

export const traditionalResultsSchema = z.object({
  nameAnalysis: numerologyAnalysisSchema,
  motherAnalysis: numerologyAnalysisSchema,
  questionAnalysis: numerologyAnalysisSchema,
  totalValue: z.number(),
  reducedValue: z.number(),
  wafqSize: z.number(),
});

export const aiAnalysisSchema = z.object({
  spiritualInterpretation: z.string(),
  numericalInsights: z.string(),
  guidance: z.string(),
  energyAnalysis: z.string(),
});

export const jafrAnalysisResponseSchema = z.object({
  traditionalResults: traditionalResultsSchema,
  aiAnalysis: aiAnalysisSchema,
  combinedInterpretation: z.string(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  jafrAnalyses: many(jafrAnalyses),
}));

export const jafrAnalysesRelations = relations(jafrAnalyses, ({ one }) => ({
  user: one(users, {
    fields: [jafrAnalyses.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertJafrAnalysisSchema = createInsertSchema(jafrAnalyses).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type JafrAnalysis = typeof jafrAnalyses.$inferSelect;
export type InsertJafrAnalysis = z.infer<typeof insertJafrAnalysisSchema>;
export type JafrAnalysisRequest = z.infer<typeof jafrAnalysisRequestSchema>;
export type JafrAnalysisResponse = z.infer<typeof jafrAnalysisResponseSchema>;
export type NumerologyAnalysis = z.infer<typeof numerologyAnalysisSchema>;
export type TraditionalResults = z.infer<typeof traditionalResultsSchema>;
export type AIAnalysis = z.infer<typeof aiAnalysisSchema>;
