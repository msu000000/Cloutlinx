import {
  users,
  hooks,
  type User,
  type InsertUser,
  type InsertHook,
  type Hook,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User>;
  updateSubscriptionTier(userId: string, tier: string, limit: number): Promise<User>;
  incrementHookUsage(userId: string): Promise<User>;
  resetMonthlyUsage(userId: string): Promise<User>;
  
  // Hook operations
  createHook(hook: InsertHook): Promise<Hook>;
  getUserHooks(userId: string, limit?: number): Promise<Hook[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId,
        stripeSubscriptionId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateSubscriptionTier(userId: string, tier: string, limit: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        subscriptionTier: tier,
        hooksLimit: limit,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async incrementHookUsage(userId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        hooksUsed: sql`${users.hooksUsed} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async resetMonthlyUsage(userId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        hooksUsed: 0,
        resetDate: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Hook operations
  async createHook(hookData: InsertHook): Promise<Hook> {
    const [hook] = await db
      .insert(hooks)
      .values(hookData)
      .returning();
    return hook;
  }

  async getUserHooks(userId: string, limit = 50): Promise<Hook[]> {
    return await db
      .select()
      .from(hooks)
      .where(eq(hooks.userId, userId))
      .orderBy(desc(hooks.createdAt))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
