import { pgTable, uuid, text, varchar, timestamp, boolean, date, integer, unique, foreignKey } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Users table first
export const user = pgTable("user", {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  email: text().notNull(),
  emailVerified: boolean().notNull(),
  image: text(),
  createdAt: date().notNull(),
  updatedAt: date().notNull(),
}, (table) => [
  unique("user_email_key").on(table.email),
]);

// Projects table (depends on user)
export const projects = pgTable("projects", {
  id: text().primaryKey().notNull(),
  userId: text("userId"),
  title: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  imageUrl: text("imageUrl"),
  tags: text().array(),
  githubRepo: varchar("githubRepo", { length: 255 }),
  liveDemo: varchar("liveDemo", { length: 255 }),
  telegramChannel: varchar("telegramChannel", { length: 255 }),
  createdAt: timestamp("createdAt", { withTimezone: true, mode: 'string' }).defaultNow(),
  likes: integer().default(0),
  comments: integer().default(0),
  documentation: text(),
  userName: text("userName"),
}, (table) => [
  foreignKey({
    columns: [table.userId],
    foreignColumns: [user.id],
    name: "projects_user_id_fkey"
  }).onDelete("cascade"),
]);

// Project Likes (depends on user & projects)
export const projectLikes = pgTable("project_likes", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: text("userId"),
  projectId: text("projectId"),
  createdAt: timestamp("createdAt", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  foreignKey({
    columns: [table.projectId],
    foreignColumns: [projects.id],
    name: "project_likes_project_id_fkey"
  }).onDelete("cascade"),
  foreignKey({
    columns: [table.userId],
    foreignColumns: [user.id],
    name: "project_likes_user_id_fkey"
  }).onDelete("cascade"),
]);

// Comments (depends on projects & user)
export const comments = pgTable("comments", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  projectId: text("projectId"),
  userId: text("userId"),
  parentId: uuid("parentId"),
  content: text().notNull(),
  createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow(),
  name: text(),
}, (table) => [
  foreignKey({
    columns: [table.parentId],
    foreignColumns: [table.id],
    name: "comments_parent_id_fkey"
  }).onDelete("cascade"),
  foreignKey({
    columns: [table.projectId],
    foreignColumns: [projects.id],
    name: "comments_project_id_fkey"
  }).onDelete("cascade"),
  foreignKey({
    columns: [table.userId],
    foreignColumns: [user.id],
    name: "comments_user_id_fkey"
  }).onDelete("cascade"),
]);

// Session table (depends on user)
export const session = pgTable("session", {
  id: text().primaryKey().notNull(),
  expiresAt: date().notNull(),
  ipAddress: text(),
  userAgent: text(),
  userId: text().notNull(),
}, (table) => [
  foreignKey({
    columns: [table.userId],
    foreignColumns: [user.id],
    name: "session_userId_fkey"
  }),
]);

// Account table (depends on user)
export const account = pgTable("account", {
  id: text().primaryKey().notNull(),
  accountId: text().notNull(),
  providerId: text().notNull(),
  userId: text().notNull(),
  accessToken: text(),
  refreshToken: text(),
  idToken: text(),
  expiresAt: date(),
  password: text(),
}, (table) => [
  foreignKey({
    columns: [table.userId],
    foreignColumns: [user.id],
    name: "account_userId_fkey"
  }),
]);

// Verification table
export const verification = pgTable("verification", {
  id: text().primaryKey().notNull(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: date().notNull(),
});
