import { relations } from "drizzle-orm";
import {
  date,
  integer,
  serial,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  name: varchar("name", { length: 256 }),
});

export const usersRelations = relations(profile, ({ many }) => ({
  chats: many(chats),
}));

export const chats = pgTable("chats", {
  id: serial("id").primaryKey().notNull(),
  chatId: uuid("chatId").notNull(),
  userId: text("userId").notNull(),
  createdAt: date("createdAt", { mode: "date" }).notNull(),
});

export const chatRelations = relations(chats, ({ one, many }) => ({
  user: one(profile, {
    fields: [chats.userId],
    references: [profile.userId],
  }),
  conversations: many(conversations),
}));

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  message: text("message"),
  role: varchar("role", { length: 256 }),
  createdAt: date("createdAt", { mode: "date" }).notNull(),
  chatId: uuid("chatId")
    .references(() => chats.chatId, { onDelete: "cascade" })
    .notNull(),
});

export const conversationsRelations = relations(conversations, ({ one }) => ({
  chat: one(chats, {
    fields: [conversations.chatId],
    references: [chats.chatId],
  }),
}));

export type Chats = typeof chats.$inferSelect;
