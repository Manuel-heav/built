import { relations } from "drizzle-orm/relations";
import { projects, projectLikes, user, session, account, comments } from "./schema";

export const projectLikesRelations = relations(projectLikes, ({one}) => ({
	project: one(projects, {
		fields: [projectLikes.projectId],
		references: [projects.id]
	}),
	user: one(user, {
		fields: [projectLikes.userId],
		references: [user.id]
	}),
}));

export const projectsRelations = relations(projects, ({one, many}) => ({
	projectLikes: many(projectLikes),
	user: one(user, {
		fields: [projects.userId],
		references: [user.id]
	}),
	comments: many(comments),
}));

export const userRelations = relations(user, ({many}) => ({
	projectLikes: many(projectLikes),
	sessions: many(session),
	accounts: many(account),
	projects: many(projects),
	comments: many(comments),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const commentsRelations = relations(comments, ({one, many}) => ({
	comment: one(comments, {
		fields: [comments.parentId],
		references: [comments.id],
		relationName: "comments_parentId_comments_id"
	}),
	comments: many(comments, {
		relationName: "comments_parentId_comments_id"
	}),
	project: one(projects, {
		fields: [comments.projectId],
		references: [projects.id]
	}),
	user: one(user, {
		fields: [comments.userId],
		references: [user.id]
	}),
}));