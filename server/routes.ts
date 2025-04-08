import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { anonymousTypingTestSchema, insertTypingTestSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all typing tests (with optional userId filter)
  app.get("/api/typing-tests", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const tests = await storage.getTypingTests(userId);
      res.json(tests);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to retrieve typing tests" });
    }
  });

  // Save a typing test result
  app.post("/api/typing-tests", async (req, res) => {
    try {
      // Handle both authenticated and anonymous users
      if (req.body.userId) {
        const validatedData = insertTypingTestSchema.parse(req.body);
        const test = await storage.saveTypingTest(validatedData);
        res.status(201).json(test);
      } else {
        // For anonymous users, just validate without saving to user account
        const validatedData = anonymousTypingTestSchema.parse(req.body);
        res.status(200).json(validatedData);
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        console.error(error);
        res.status(500).json({ message: "Failed to save typing test result" });
      }
    }
  });

  // Get user settings
  app.get("/api/user-settings/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const settings = await storage.getUserSettings(userId);
      
      if (!settings) {
        return res.status(404).json({ message: "User settings not found" });
      }
      
      res.json(settings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to retrieve user settings" });
    }
  });

  // Update user settings
  app.put("/api/user-settings/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const settings = await storage.updateUserSettings(userId, req.body);
      res.json(settings);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        console.error(error);
        res.status(500).json({ message: "Failed to update user settings" });
      }
    }
  });

  // Get texts for typing modes
  app.get("/api/texts/:mode", (req, res) => {
    try {
      const mode = req.params.mode;
      const count = req.query.count ? parseInt(req.query.count as string) : 1;
      const duration = req.query.duration ? parseInt(req.query.duration as string) : 30;
      
      // This returns texts with appropriate length based on duration
      const texts = storage.getTexts(mode, count, duration);
      res.json(texts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to retrieve texts" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
