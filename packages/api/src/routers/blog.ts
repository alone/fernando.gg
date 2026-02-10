import { db } from "@fernando/db";
import { post } from "@fernando/db/schema";
import { TRPCError } from "@trpc/server";
import { desc, eq, sql } from "drizzle-orm";
import z from "zod";
import {
	BLOG_DEFAULT_PAGE_SIZE,
	PAGINATION_MAX_LIMIT,
	SLUG_MAX_LENGTH,
} from "../constants";
import {
	adminProcedure,
	protectedProcedure,
	publicProcedure,
	router,
} from "../index";
import { isUniqueViolation, throwConflict } from "../utils/db-errors";
import {
	fetchMarkdownFromGithub,
	invalidateGithubCache,
} from "../utils/github";

const slugSchema = z
	.string()
	.min(1)
	.max(SLUG_MAX_LENGTH)
	.regex(
		/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
		"Slug must be lowercase alphanumeric with hyphens"
	);

const idSchema = z.uuid();

export const blogRouter = router({
	list: publicProcedure
		.input(
			z
				.object({
					limit: z
						.number()
						.min(1)
						.max(PAGINATION_MAX_LIMIT)
						.default(BLOG_DEFAULT_PAGE_SIZE),
					offset: z.number().min(0).default(0),
				})
				.default({ limit: BLOG_DEFAULT_PAGE_SIZE, offset: 0 })
		)
		.query(async ({ input }) => {
			const posts = await db.query.post.findMany({
				orderBy: [desc(post.publishedAt)],
				limit: input.limit,
				offset: input.offset,
			});

			return posts;
		}),
	getBySlug: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(async ({ input }) => {
			const found = await db.query.post.findFirst({
				where: eq(post.slug, input.slug),
			});

			if (!found) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Post not found",
				});
			}

			const content = await fetchMarkdownFromGithub(found.githubPath);

			return {
				...found,
				content,
			};
		}),
	listAll: protectedProcedure.query(async () => {
		const posts = await db.query.post.findMany({
			orderBy: [desc(post.createdAt)],
		});
		return posts;
	}),
	getById: protectedProcedure
		.input(z.object({ id: idSchema }))
		.query(async ({ input }) => {
			const found = await db.query.post.findFirst({
				where: eq(post.id, input.id),
			});

			if (!found) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Post not found",
				});
			}

			return found;
		}),

	create: adminProcedure
		.input(
			z.object({
				title: z.string().min(1),
				slug: slugSchema,
				description: z.string().optional(),
				githubPath: z.string().min(1),
				coverImage: z.string().url().optional(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			try {
				await fetchMarkdownFromGithub(input.githubPath);
			} catch {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: `Content not found at GitHub path "${input.githubPath}". Make sure the file exists in the repository.`,
				});
			}

			try {
				const [created] = await db
					.insert(post)
					.values({
						...input,
						publishedAt: new Date(),
						authorId: ctx.session.user.id,
					})
					.returning();

				return created;
			} catch (err) {
				if (isUniqueViolation(err)) {
					throwConflict("A post with this slug already exists");
				}
				throw err;
			}
		}),

	update: adminProcedure
		.input(
			z.object({
				id: idSchema,
				title: z.string().min(1).optional(),
				slug: slugSchema.optional(),
				description: z.string().optional(),
				githubPath: z.string().min(1).optional(),
				coverImage: z.string().url().optional(),
			})
		)
		.mutation(async ({ input }) => {
			const { id, ...data } = input;

			if (data.githubPath) {
				try {
					await fetchMarkdownFromGithub(data.githubPath);
				} catch {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: `Content not found at GitHub path "${data.githubPath}". Make sure the file exists in the repository.`,
					});
				}
			}

			return await db.transaction(async (tx) => {
				const [existing] = await tx.execute(
					sql`SELECT "id", "github_path" FROM "post" WHERE "id" = ${id} FOR UPDATE`
				);

				if (!existing) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Post not found",
					});
				}

				try {
					const [updated] = await tx
						.update(post)
						.set(data)
						.where(eq(post.id, id))
						.returning();

					if (!updated) {
						throw new TRPCError({
							code: "NOT_FOUND",
							message: "Post not found",
						});
					}

					if (data.githubPath && data.githubPath !== existing.github_path) {
						invalidateGithubCache(existing.github_path as string);
					}

					return updated;
				} catch (err) {
					if (isUniqueViolation(err)) {
						throwConflict("A post with this slug already exists");
					}
					throw err;
				}
			});
		}),

	delete: adminProcedure
		.input(z.object({ id: idSchema }))
		.mutation(async ({ input }) => {
			const [deleted] = await db
				.delete(post)
				.where(eq(post.id, input.id))
				.returning();

			if (!deleted) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Post not found",
				});
			}

			invalidateGithubCache(deleted.githubPath);

			return { success: true };
		}),
});
