import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

import SiteFooter from "@/components/site-footer";
import {
	BANNER_IMAGE_HEIGHT,
	BANNER_IMAGE_WIDTH,
	DEFAULT_PAGE_SIZE,
	GLOW_IMAGE_SRC,
	HOME_LATEST_POSTS_LIMIT,
	HOME_LATEST_PROJECTS_LIMIT,
} from "@/lib/constants";
import { formatDate } from "@/lib/format-date";
import { trpc } from "@/utils/trpc";

export const Route = createFileRoute("/")({
	component: HomeComponent,
	loader: ({ context: { queryClient } }) =>
		Promise.all([
			queryClient.ensureQueryData(
				trpc.blog.list.queryOptions({
					limit: HOME_LATEST_POSTS_LIMIT,
					offset: 0,
				})
			),
			queryClient.ensureQueryData(
				trpc.project.latest.queryOptions({
					limit: HOME_LATEST_PROJECTS_LIMIT,
				})
			),
		]),
});

const fadeUp = {
	hidden: { opacity: 0, y: 30 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, delay: i * 0.15, ease: "easeOut" as const },
	}),
};

function HomeComponent() {
	const { data: latestPosts } = useQuery(
		trpc.blog.list.queryOptions({ limit: HOME_LATEST_POSTS_LIMIT, offset: 0 })
	);
	const { data: latestProjects } = useQuery(
		trpc.project.latest.queryOptions({ limit: HOME_LATEST_PROJECTS_LIMIT })
	);

	const latestPost = latestPosts?.[0];
	const projects = latestProjects ?? [];

	return (
		<div className="min-h-full bg-black text-white">
			<section className="relative min-h-[80svh] overflow-hidden px-6 py-16 sm:py-24">
				<motion.img
					alt=""
					animate={{ scale: 1, opacity: 1 }}
					className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top"
					height={BANNER_IMAGE_HEIGHT}
					initial={{ scale: 1.1, opacity: 0 }}
					src={GLOW_IMAGE_SRC}
					transition={{ duration: 1.2, ease: "easeOut" }}
					width={BANNER_IMAGE_WIDTH}
				/>
				<div className="pointer-events-none absolute inset-0 bg-black/50" />
				<div className="relative flex flex-col gap-16 sm:flex-row sm:items-center sm:justify-between">
					<motion.h1
						animate="visible"
						className="font-pixel-square text-[clamp(6rem,14vw,12rem)] leading-[0.85] tracking-tight"
						custom={0}
						initial="hidden"
						variants={fadeUp}
					>
						FER
						<br />
						NANDO
					</motion.h1>
					<motion.p
						animate="visible"
						className="max-w-md text-white text-xl leading-relaxed sm:text-right sm:text-3xl"
						custom={1}
						initial="hidden"
						variants={fadeUp}
					>
						I build systems that perform under pressure. 40+ projects shipped
						across full-stack apps, developer tools, and security research —
						from architecture to deployment.
					</motion.p>
				</div>
			</section>

			<section className="bg-white px-6 py-10 text-black sm:py-16">
				<div className="mx-auto max-w-4xl">
					<motion.h2
						className="mb-5 font-pixel-square text-neutral-500 text-xs uppercase"
						initial={{ opacity: 0 }}
						transition={{ duration: 0.5 }}
						viewport={{ once: true }}
						whileInView={{ opacity: 1 }}
					>
						Latest post
					</motion.h2>
					{latestPost ? (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							transition={{ duration: 0.5, delay: 0.1 }}
							viewport={{ once: true }}
							whileInView={{ opacity: 1, y: 0 }}
						>
							<Link
								className="block border border-neutral-200 p-5 transition-colors hover:bg-neutral-50"
								params={{ slug: latestPost.slug }}
								to="/blog/$slug"
							>
								{latestPost.publishedAt && (
									<span className="mb-2 block text-neutral-400 text-xs uppercase">
										{formatDate(latestPost.publishedAt, "short")}
									</span>
								)}
								<span className="mb-2 block font-pixel-square text-base">
									{latestPost.title}
								</span>
								{latestPost.description && (
									<span className="block text-neutral-500 text-sm leading-relaxed">
										{latestPost.description}
									</span>
								)}
							</Link>
						</motion.div>
					) : (
						<motion.div
							className="border border-neutral-200 border-dashed p-8 text-center"
							initial={{ opacity: 0, y: 20 }}
							transition={{ duration: 0.5, delay: 0.1 }}
							viewport={{ once: true }}
							whileInView={{ opacity: 1, y: 0 }}
						>
							<p className="text-neutral-400 text-sm">
								No posts yet. Check back soon.
							</p>
						</motion.div>
					)}
					<motion.div
						className="mt-5"
						initial={{ opacity: 0 }}
						transition={{ duration: 0.4, delay: 0.2 }}
						viewport={{ once: true }}
						whileInView={{ opacity: 1 }}
					>
						<Link
							className="inline-block border border-neutral-300 bg-transparent px-6 py-3 text-black text-xs uppercase tracking-[0.2em] transition-colors hover:bg-black hover:text-white"
							to="/blog"
						>
							<span className="font-pixel-square leading-[0.85] tracking-tight">
								View all posts
							</span>
						</Link>
					</motion.div>

					<div className="mt-10 border-neutral-200 border-t pt-8">
						<motion.h2
							className="mb-5 font-pixel-square text-neutral-500 text-xs uppercase"
							initial={{ opacity: 0 }}
							transition={{ duration: 0.5 }}
							viewport={{ once: true }}
							whileInView={{ opacity: 1 }}
						>
							Projects
						</motion.h2>
						{projects.length > 0 ? (
							<div className="grid gap-4 sm:grid-cols-3">
								{projects.map((proj, i) => (
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										key={proj.id}
										transition={{
											duration: 0.5,
											delay: i * 0.1,
										}}
										viewport={{ once: true }}
										whileInView={{ opacity: 1, y: 0 }}
									>
										<Link
											className="block border border-neutral-200 p-5 transition-colors hover:bg-neutral-50"
											params={{ slug: proj.slug }}
											to="/projects/$slug"
										>
											<span className="mb-3 block font-pixel-square text-neutral-600 text-xs uppercase">
												{proj.tag}
											</span>
											<h3 className="mb-2 font-pixel-square text-sm">
												{proj.title}
											</h3>
											{proj.description && (
												<p className="mb-4 line-clamp-3 text-neutral-500 text-sm leading-relaxed">
													{proj.description}
												</p>
											)}
											{proj.stack.length > 0 && (
												<div className="flex flex-wrap gap-1">
													{proj.stack.map((s) => (
														<span
															className="border border-neutral-200 px-2 py-0.5 text-[10px] text-neutral-400 uppercase"
															key={s}
														>
															{s}
														</span>
													))}
												</div>
											)}
										</Link>
									</motion.div>
								))}
							</div>
						) : (
							<motion.div
								className="border border-neutral-200 border-dashed p-8 text-center"
								initial={{ opacity: 0, y: 20 }}
								transition={{ duration: 0.5, delay: 0.1 }}
								viewport={{ once: true }}
								whileInView={{ opacity: 1, y: 0 }}
							>
								<p className="text-neutral-400 text-sm">
									No projects yet. Check back soon.
								</p>
							</motion.div>
						)}
						<motion.div
							className="mt-5"
							initial={{ opacity: 0 }}
							transition={{ duration: 0.4, delay: 0.3 }}
							viewport={{ once: true }}
							whileInView={{ opacity: 1 }}
						>
							<Link
								className="inline-block border border-neutral-300 bg-transparent px-6 py-3 text-black text-xs uppercase tracking-[0.2em] transition-colors hover:bg-black hover:text-white"
								search={{ page: 1, pageSize: DEFAULT_PAGE_SIZE }}
								to="/projects"
							>
								<span className="font-pixel-square leading-[0.85] tracking-tight">
									View all projects
								</span>
							</Link>
						</motion.div>
					</div>
				</div>
			</section>
			<SiteFooter />
		</div>
	);
}
