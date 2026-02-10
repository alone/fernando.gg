import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const project = pgTable(
	"project",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		title: text("title").notNull(),
		slug: text("slug").notNull().unique(),
		description: text("description"),
		tag: text("tag").notNull(),
		stack: text("stack").array().notNull().default([]),
		githubUrl: text("github_url"),
		liveUrl: text("live_url"),
		coverImage: text("cover_image"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("project_slug_idx").on(table.slug),
		index("project_tag_idx").on(table.tag),
	]
);
