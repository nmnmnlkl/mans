import { 
  users, 
  jafrAnalyses,
  type User, 
  type InsertUser,
  type JafrAnalysis,
  type InsertJafrAnalysis
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveJafrAnalysis(analysis: InsertJafrAnalysis): Promise<JafrAnalysis>;
  getUserJafrAnalyses(userId?: number): Promise<JafrAnalysis[]>;
  getJafrAnalysis(id: number): Promise<JafrAnalysis | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async saveJafrAnalysis(analysis: InsertJafrAnalysis): Promise<JafrAnalysis> {
    const [savedAnalysis] = await db
      .insert(jafrAnalyses)
      .values(analysis)
      .returning();
    return savedAnalysis;
  }

  async getUserJafrAnalyses(userId?: number): Promise<JafrAnalysis[]> {
    if (userId) {
      return await db
        .select()
        .from(jafrAnalyses)
        .where(eq(jafrAnalyses.userId, userId))
        .orderBy(desc(jafrAnalyses.createdAt));
    } else {
      return await db
        .select()
        .from(jafrAnalyses)
        .orderBy(desc(jafrAnalyses.createdAt))
        .limit(50);
    }
  }

  async getJafrAnalysis(id: number): Promise<JafrAnalysis | undefined> {
    const [analysis] = await db
      .select()
      .from(jafrAnalyses)
      .where(eq(jafrAnalyses.id, id));
    return analysis || undefined;
  }
}

export const storage = new DatabaseStorage();
