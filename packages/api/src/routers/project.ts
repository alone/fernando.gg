import { db } from "@fernando/db";
import { project } from "@fernando/db/schema";
import { TRPCError } from "@trpc/server";
import {
	and,
	arrayContains,
	count,
	desc,
	eq,
	type SQL,
	sql,
} from "drizzle-orm";
import z from "zod";
import {
	LATEST_PROJECTS_DEFAULT_LIMIT,
	LATEST_PROJECTS_MAX_LIMIT,
	PAGINATION_MAX_LIMIT,
	PROJECT_DEFAULT_PAGE_SIZE,
	SLUG_MAX_LENGTH,
} from "../constants";
import {
	adminProcedure,
	protectedProcedure,
	publicProcedure,
	router,
} from "../index";
import { isUniqueViolation, throwConflict } from "../utils/db-errors";

const slugSchema = z
	.string()
	.min(1)
	.max(SLUG_MAX_LENGTH)
	.regex(
		/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
		"Slug must be lowercase alphanumeric with hyphens"
	);

const idSchema = z.uuid();

export const projectRouter = router({
	list: publicProcedure
		.input(
			z
				.object({
					limit: z
						.number()
						.min(1)
						.max(PAGINATION_MAX_LIMIT)
						.default(PROJECT_DEFAULT_PAGE_SIZE),
					page: z.number().min(1).default(1),
					tag: z.string().optional(),
					stack: z.string().optional(),
				})
				.default({ limit: PROJECT_DEFAULT_PAGE_SIZE, page: 1 })
		)
		.query(async ({ input }) => {
			const { limit, page } = input;
			const offset = (page - 1) * limit;

			const conditions: SQL[] = [];

			if (input.tag) {
				conditions.push(eq(project.tag, input.tag));
			}

			if (input.stack) {
				conditions.push(arrayContains(project.stack, [input.stack]));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;

			const [projects, [totalResult]] = await Promise.all([
				db.query.project.findMany({
					where,
					orderBy: [desc(project.createdAt)],
					limit,
					offset,
				}),
				db.select({ count: count() }).from(project).where(where),
			]);

			const total = totalResult?.count ?? 0;

			return {
				items: projects,
				total,
				page,
				pageSize: limit,
				totalPages: Math.ceil(total / limit),
			};
		}),

	tags: publicProcedure.query(async () => {
		const result = await db
			.selectDistinct({ tag: project.tag })
			.from(project)
			.orderBy(project.tag);
		return result.map((r) => r.tag);
	}),

	stacks: publicProcedure.query(async () => {
		const rows = await db.execute(
			sql`SELECT DISTINCT unnest(${project.stack}) AS stack FROM ${project} ORDER BY stack`
		);
		return rows.map((r) => String(r.stack));
	}),

	getBySlug: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(async ({ input }) => {
			const found = await db.query.project.findFirst({
				where: eq(project.slug, input.slug),
			});

			if (!found) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Project not found",
				});
			}

			return found;
		}),

	latest: publicProcedure
		.input(
			z
				.object({
					limit: z
						.number()
						.min(1)
						.max(LATEST_PROJECTS_MAX_LIMIT)
						.default(LATEST_PROJECTS_DEFAULT_LIMIT),
				})
				.default({ limit: LATEST_PROJECTS_DEFAULT_LIMIT })
		)
		.query(async ({ input }) => {
			const projects = await db.query.project.findMany({
				orderBy: [desc(project.createdAt)],
				limit: input.limit,
			});

			return projects;
		}),

	getById: protectedProcedure
		.input(z.object({ id: idSchema }))
		.query(async ({ input }) => {
			const found = await db.query.project.findFirst({
				where: eq(project.id, input.id),
			});

			if (!found) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Project not found",
				});
			}

			return found;
		}),

	listAll: protectedProcedure.query(async () => {
		const projects = await db.query.project.findMany({
			orderBy: [desc(project.createdAt)],
		});
		return projects;
	}),

	create: adminProcedure
		.input(
			z.object({
				title: z.string().min(1),
				slug: slugSchema,
				description: z.string().optional(),
				tag: z.string().min(1),
				stack: z.array(z.string()).default([]),
				githubUrl: z.string().url().optional(),
				liveUrl: z.string().url().optional(),
				coverImage: z.string().url().optional(),
			})
		)
		.mutation(async ({ input }) => {
			try {
				const [created] = await db.insert(project).values(input).returning();

				return created;
			} catch (err) {
				if (isUniqueViolation(err)) {
					throwConflict("A project with this slug already exists");
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
				tag: z.string().min(1).optional(),
				stack: z.array(z.string()).optional(),
				githubUrl: z.string().url().optional(),
				liveUrl: z.string().url().optional(),
				coverImage: z.string().url().optional(),
			})
		)
		.mutation(async ({ input }) => {
			const { id, ...data } = input;

			return await db.transaction(async (tx) => {
				const [existing] = await tx.execute(
					sql`SELECT "id" FROM "project" WHERE "id" = ${id} FOR UPDATE`
				);

				if (!existing) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Project not found",
					});
				}

				try {
					const [updated] = await tx
						.update(project)
						.set(data)
						.where(eq(project.id, id))
						.returning();

					if (!updated) {
						throw new TRPCError({
							code: "NOT_FOUND",
							message: "Project not found",
						});
					}

					return updated;
				} catch (err) {
					if (isUniqueViolation(err)) {
						throwConflict("A project with this slug already exists");
					}
					throw err;
				}
			});
		}),

	delete: adminProcedure
		.input(z.object({ id: idSchema }))
		.mutation(async ({ input }) => {
			const [deleted] = await db
				.delete(project)
				.where(eq(project.id, input.id))
				.returning();

			if (!deleted) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Project not found",
				});
			}

			return { success: true };
		}),
});
