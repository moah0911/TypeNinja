import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const typingTests = pgTable("typing_tests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  wpm: integer("wpm").notNull(),
  accuracy: integer("accuracy").notNull(),
  duration: integer("duration").notNull(),
  mode: text("mode").notNull(),
  characters: integer("characters").notNull(),
  errors: integer("errors").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  soundEnabled: boolean("sound_enabled").default(true),
  caretStyle: text("caret_style").default("line"),
  showKeyboard: boolean("show_keyboard").default(false),
  showLiveWpm: boolean("show_live_wpm").default(true),
  smoothCaret: boolean("smooth_caret").default(true),
  theme: text("theme").default("default"),
  fontFamily: text("font_family").default("Roboto Mono"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTypingTestSchema = createInsertSchema(typingTests).omit({
  id: true,
  timestamp: true,
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTypingTest = z.infer<typeof insertTypingTestSchema>;
export type TypingTest = typeof typingTests.$inferSelect;

export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type UserSettings = typeof userSettings.$inferSelect;

// Type for anonymous typing test results (no userId)
export const anonymousTypingTestSchema = z.object({
  wpm: z.number(),
  accuracy: z.number(),
  duration: z.number(),
  mode: z.string(),
  characters: z.number(),
  errors: z.number(),
});

export type AnonymousTypingTest = z.infer<typeof anonymousTypingTestSchema>;
