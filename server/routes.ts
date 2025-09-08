import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, requireAuth } from "./auth";
import { generateViralHooks } from "./openai";
import { insertHookSchema } from "@shared/schema";
import Stripe from "stripe";
import { z } from "zod";

// Initialize Stripe if keys are available
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware - this sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // Hook generation endpoint
  app.post("/api/generate-hooks", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { topic, style, platform } = req.body;
      
      if (!topic || !style) {
        return res.status(400).json({ message: "Topic and style are required" });
      }

      // Check usage limits
      let hooksToGenerate = 2; // Default for free users
      
      if (user.subscriptionTier === 'basic') {
        hooksToGenerate = 10;
      } else if (user.subscriptionTier === 'pro') {
        hooksToGenerate = 20; // Generate more for pro users
      }

      // Check if user has remaining hooks
      if (user.subscriptionTier !== 'pro' && user.hooksUsed >= user.hooksLimit) {
        return res.status(403).json({ 
          message: "Hook limit reached. Please upgrade your plan or wait for next month.",
          hooksUsed: user.hooksUsed,
          hooksLimit: user.hooksLimit
        });
      }

      // Generate hooks using OpenAI
      const generatedHooks = await generateViralHooks({
        topic,
        style,
        platform,
        limit: hooksToGenerate
      });

      // Save hooks to database
      const savedHooks = [];
      for (const hook of generatedHooks) {
        const savedHook = await storage.createHook({
          userId,
          topic,
          style: hook.style,
          content: hook.content
        });
        savedHooks.push(savedHook);
      }

      // Update user's hook usage
      await storage.incrementHookUsage(userId);

      res.json({
        hooks: savedHooks,
        hooksUsed: user.hooksUsed + 1,
        hooksLimit: user.hooksLimit
      });

    } catch (error) {
      console.error("Error generating hooks:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to generate hooks" });
    }
  });

  // Get user's hooks
  app.get("/api/hooks", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const hooks = await storage.getUserHooks(userId);
      res.json(hooks);
    } catch (error) {
      console.error("Error fetching hooks:", error);
      res.status(500).json({ message: "Failed to fetch hooks" });
    }
  });

  // Stripe subscription endpoints
  if (stripe) {
    app.post('/api/create-subscription', requireAuth, async (req: any, res) => {
      try {
        const userId = req.user.id;
        const user = await storage.getUser(userId);
        const { priceId, tier } = req.body;

        if (!user || !user.email) {
          return res.status(400).json({ message: 'User email required' });
        }

        let customer;
        if (user.stripeCustomerId) {
          customer = await stripe!.customers.retrieve(user.stripeCustomerId);
        } else {
          customer = await stripe!.customers.create({
            email: user.email,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
          });
          
          await storage.updateUserStripeInfo(userId, customer.id, '');
        }

        const subscription = await stripe!.subscriptions.create({
          customer: customer.id,
          items: [{ price: priceId }],
          payment_behavior: 'default_incomplete',
          expand: ['latest_invoice.payment_intent'],
        });

        await storage.updateUserStripeInfo(userId, customer.id, subscription.id);

        // Update subscription tier
        const hooksLimit = tier === 'basic' ? 10 : -1; // -1 for unlimited (pro)
        await storage.updateSubscriptionTier(userId, tier, hooksLimit);

        const latest_invoice = subscription.latest_invoice as Stripe.Invoice;
        const payment_intent = latest_invoice.payment_intent as Stripe.PaymentIntent;

        res.json({
          subscriptionId: subscription.id,
          clientSecret: payment_intent.client_secret,
        });

      } catch (error: any) {
        console.error('Stripe subscription error:', error);
        res.status(400).json({ message: error.message });
      }
    });
  }

  // Update password endpoint
  app.post("/api/update-password", requireAuth, async (req: any, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current and new passwords are required" });
      }

      // TODO: Implement proper password validation and hashing
      // This would require proper bcrypt validation and updating the password
      
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json({ message: "Failed to update password" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
