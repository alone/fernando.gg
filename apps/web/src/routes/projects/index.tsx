import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
	createStandardSchemaV1,
	parseAsInteger,
	parseAsString,
	useQueryStates,
} from "nuqs";
import { useState } from "react";

import { FilterModal } from "@/components/projects/filter-modal";
import { ProjectCard } from "@/components/projects/project-card";
import SiteFooter from "@/components/site-footer";
import {
	BANNER_IMAGE_HEIGHT,
	BANNER_IMAGE_SRC,
	BANNER_IMAGE_WIDTH,
	DEFAULT_PAGE_SIZE,
	FILTER_STALE_TIME_MS,
	MAX_SKELETON_ITEMS,
	PAGE_SIZE_OPTIONS,
} from "@/lib/constants";
import { trpc } from "@/utils/trpc";

const searchParams = {
	page: parseAsInteger.withDefault(1),
	pageSize: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),
	tag: parseAsString,
	stack: parseAsString,
};

export const Route = createFileRoute("/projects/")({
	component: ProjectsListComponent,
	validateSearch: createStandardSchemaV1(searchParams, {
		partialOutput: true,
	}),
	loader: ({ context: { queryClient } }) =>
		Promise.all([
			queryClient.ensureQueryData({
				...trpc.project.tags.queryOptions(),
				staleTime: FILTER_STALE_TIME_MS,
			}),
			queryClient.ensureQueryData({
				...trpc.project.stacks.queryOptions(),
				staleTime: FILTER_STALE_TIME_MS,
			}),
		]),
});

function ProjectsListComponent() {
	const [{ page, pageSize, tag, stack }, setSearch] =
		useQueryStates(searchParams);
	const [filterOpen, setFilterOpen] = useState(false);

	const { data, isLoading } = useQuery(
		trpc.project.list.queryOptions({
			page,
			limit: pageSize,
			tag: tag ?? undefined,
			stack: stack ?? undefined,
		})
	);

	const { data: apiTags } = useQuery({
		...trpc.project.tags.queryOptions(),
		staleTime: FILTER_STALE_TIME_MS,
	});
	const { data: apiStacks } = useQuery({
		...trpc.project.stacks.queryOptions(),
		staleTime: FILTER_STALE_TIME_MS,
	});

	const setFilter = (updates: {
		tag?: string | null;
		stack?: string | null;
		pageSize?: number | null;
	}) => {
		setSearch({ page: 1, ...updates });
	};

	const setPage = (p: number) => {
		setSearch({ page: p });
	};

	const activeFilterCount = (tag ? 1 : 0) + (stack ? 1 : 0);

	const projects = data?.items ?? [];
	const totalPages = data?.totalPages ?? 1;
	const tags = apiTags ?? [];
	const stacks = apiStacks ?? [];

	return (
		<div className="min-h-full bg-black text-white">
			<section className="relative overflow-hidden px-6 py-16 sm:py-24">
				<motion.img
					alt=""
					animate={{ scale: 1.25, opacity: 1 }}
					className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
					height={BANNER_IMAGE_HEIGHT}
					initial={{ scale: 1.4, opacity: 0 }}
					src={BANNER_IMAGE_SRC}
					transition={{ duration: 1.2, ease: "easeOut" }}
					width={BANNER_IMAGE_WIDTH}
				/>
				<div className="pointer-events-none absolute inset-0 bg-black/50" />
				<div className="relative mx-auto max-w-4xl">
					<motion.div
						animate={{ opacity: 1, x: 0 }}
						initial={{ opacity: 0, x: -20 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						<Link
							className="mb-8 block text-white text-xs uppercase tracking-[0.2em] transition-opacity hover:opacity-90"
							to="/"
						>
							&larr; back
						</Link>
					</motion.div>
					<motion.h1
						animate={{ opacity: 1, y: 0 }}
						className="font-pixel-square text-[clamp(3rem,10vw,7rem)] leading-[0.9] tracking-tight"
						initial={{ opacity: 0, y: 30 }}
						transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
					>
						PROJECTS
					</motion.h1>
				</div>
			</section>

			<section className="bg-white px-6 py-10 text-black sm:py-16">
				<div className="mx-auto max-w-4xl">
					<FilterModal
						activeFilterCount={activeFilterCount}
						filterOpen={filterOpen}
						projectCount={projects.length}
						setFilter={setFilter}
						setFilterOpen={setFilterOpen}
						stack={stack}
						stacks={stacks}
						tag={tag}
						tags={tags}
					/>

					{isLoading && (
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{Array.from({
								length:
									pageSize > MAX_SKELETON_ITEMS ? MAX_SKELETON_ITEMS : pageSize,
							}).map((_, i) => (
								<div
									className="animate-pulse border border-neutral-200 p-5"
									key={`sk-${
										// biome-ignore lint/suspicious/noArrayIndexKey: skeleton
										i
									}`}
								>
									<div className="mb-3 h-3 w-16 bg-neutral-200" />
									<div className="mb-2 h-5 w-2/3 bg-neutral-200" />
									<div className="mb-4 h-4 w-full bg-neutral-100" />
									<div className="flex gap-1">
										<div className="h-5 w-12 bg-neutral-100" />
										<div className="h-5 w-14 bg-neutral-100" />
									</div>
								</div>
							))}
						</div>
					)}
					{!isLoading && projects.length === 0 && (
						<motion.div
							animate={{ opacity: 1, scale: 1 }}
							className="p-10 text-center"
							initial={{ opacity: 0, scale: 0.95 }}
							transition={{ duration: 0.5 }}
						>
							<span className="mb-3 block font-pixel-square text-2xl">
								Nothing here yet
							</span>
							<p className="mx-auto max-w-xs text-neutral-400 text-sm leading-relaxed">
								{tag || stack
									? "Try adjusting your filters or check back later."
									: "Projects are on their way. Check back soon."}
							</p>
							{tag || stack ? (
								<button
									className="mt-6 inline-block border border-neutral-300 px-6 py-3 text-black text-xs uppercase tracking-[0.2em] transition-colors hover:bg-black hover:text-white"
									onClick={() =>
										setFilter({
											tag: null,
											stack: null,
										})
									}
									type="button"
								>
									<span className="font-pixel-square leading-[0.85] tracking-tight">
										Clear filters
									</span>
								</button>
							) : (
								<Link
									className="mt-6 inline-block border border-neutral-300 px-6 py-3 text-black text-xs uppercase tracking-[0.2em] transition-colors hover:bg-black hover:text-white"
									to="/"
								>
									<span className="font-pixel-square leading-[0.85] tracking-tight">
										Back home
									</span>
								</Link>
							)}
						</motion.div>
					)}
					{!isLoading && projects.length > 0 && (
						<>
							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{projects.map((proj, i) => (
									<ProjectCard index={i} key={proj.id} project={proj} />
								))}
							</div>
							<motion.div
								className="mt-8 flex flex-wrap items-center justify-between gap-4"
								initial={{ opacity: 0 }}
								transition={{ duration: 0.4, delay: 0.2 }}
								viewport={{ once: true }}
								whileInView={{ opacity: 1 }}
							>
								<div className="flex items-center gap-2 text-neutral-400 text-xs">
									<span className="font-pixel-square uppercase">Show</span>
									<select
										className="border border-neutral-200 bg-white px-2 py-1 text-black text-xs outline-none transition-colors hover:border-black"
										onChange={(e) =>
											setFilter({
												pageSize: Number(e.target.value),
											})
										}
										value={pageSize}
									>
										{PAGE_SIZE_OPTIONS.map((size) => (
											<option key={size} value={size}>
												{size}
											</option>
										))}
									</select>
								</div>
								{totalPages > 1 && (
									<div className="flex items-center gap-2">
										<button
											className="border border-neutral-300 px-3 py-1.5 font-pixel-square text-xs uppercase transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
											disabled={page <= 1}
											onClick={() => setPage(page - 1)}
											type="button"
										>
											&larr; prev
										</button>
										{Array.from({ length: totalPages }).map((_, i) => (
											<button
												className={`border px-3 py-1.5 text-xs transition-colors ${
													page === i + 1
														? "border-black bg-black text-white"
														: "border-neutral-300 text-neutral-500 hover:border-black hover:text-black"
												}`}
												key={`page-${
													// biome-ignore lint/suspicious/noArrayIndexKey: pagination
													i
												}`}
												onClick={() => setPage(i + 1)}
												type="button"
											>
												{i + 1}
											</button>
										))}
										<button
											className="border border-neutral-300 px-3 py-1.5 font-pixel-square text-xs uppercase transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
											disabled={page >= totalPages}
											onClick={() => setPage(page + 1)}
											type="button"
										>
											next &rarr;
										</button>
									</div>
								)}
							</motion.div>
						</>
					)}
				</div>
			</section>

			<SiteFooter />
		</div>
	);
}
