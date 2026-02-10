import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import SiteFooter from "@/components/site-footer";
import {
	BANNER_IMAGE_HEIGHT,
	BANNER_IMAGE_SRC,
	BANNER_IMAGE_WIDTH,
	DEFAULT_PAGE_SIZE,
	PROJECT_COVER_IMAGE_SIZE,
} from "@/lib/constants";
import { trpc } from "@/utils/trpc";

export const Route = createFileRoute("/projects/$slug")({
	component: ProjectDetailComponent,
	loader: ({ context: { queryClient }, params: { slug } }) =>
		queryClient.ensureQueryData(trpc.project.getBySlug.queryOptions({ slug })),
});

function ProjectDetailComponent() {
	const { slug } = Route.useParams();
	const {
		data: project,
		isPending,
		error,
	} = useQuery(trpc.project.getBySlug.queryOptions({ slug }));

	if (isPending) {
		return (
			<div className="min-h-full bg-black text-white">
				<section className="relative overflow-hidden px-6 pt-16 pb-10 sm:pt-24 sm:pb-14">
					<img
						alt=""
						className="pointer-events-none absolute inset-0 h-full w-full object-cover"
						height={BANNER_IMAGE_HEIGHT}
						src={BANNER_IMAGE_SRC}
						width={BANNER_IMAGE_WIDTH}
					/>
					<div className="pointer-events-none absolute inset-0 bg-black/50" />
					<div className="relative mx-auto max-w-4xl animate-pulse">
						<div className="mb-8 h-3 w-28 bg-neutral-700/50" />
						<div className="h-[clamp(2rem,6vw,4rem)] w-3/4 bg-neutral-700/50" />
					</div>
				</section>
				<section className="bg-white px-6 py-10 sm:py-16">
					<div className="mx-auto grid max-w-4xl animate-pulse gap-10 md:grid-cols-2">
						<div className="space-y-4">
							<div className="h-3 w-16 bg-neutral-200" />
							<div className="h-6 w-3/4 bg-neutral-200" />
							<div className="h-4 w-full bg-neutral-200" />
							<div className="h-4 w-5/6 bg-neutral-200" />
							<div className="h-4 w-4/6 bg-neutral-200" />
						</div>
						<div className="space-y-4">
							<div className="aspect-video w-full rounded-2xl bg-neutral-200" />
							<div className="flex gap-1.5">
								<div className="h-6 w-14 bg-neutral-100" />
								<div className="h-6 w-16 bg-neutral-100" />
								<div className="h-6 w-12 bg-neutral-100" />
							</div>
						</div>
					</div>
				</section>
				<SiteFooter />
			</div>
		);
	}

	if (error || !project) {
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
								search={{ page: 1, pageSize: DEFAULT_PAGE_SIZE }}
								to="/projects"
							>
								&larr; back to projects
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
						<motion.div
							animate={{ opacity: 1, scale: 1 }}
							className="p-10 text-center"
							initial={{ opacity: 0, scale: 0.95 }}
							transition={{ duration: 0.5 }}
						>
							<span className="mb-3 block font-pixel-square text-2xl">
								Project not found
							</span>
							<p className="mx-auto max-w-xs text-neutral-400 text-sm leading-relaxed">
								The project you're looking for doesn't exist or has been
								removed.
							</p>
							<Link
								className="mt-6 inline-block border border-neutral-300 px-6 py-3 text-black text-xs uppercase tracking-[0.2em] transition-colors hover:bg-black hover:text-white"
								search={{ page: 1, pageSize: DEFAULT_PAGE_SIZE }}
								to="/projects"
							>
								<span className="font-pixel-square leading-[0.85] tracking-tight">
									Back to projects
								</span>
							</Link>
						</motion.div>
					</div>
				</section>

				<SiteFooter />
			</div>
		);
	}

	return (
		<div className="min-h-full bg-black text-white">
			<section className="relative overflow-hidden px-6 pt-16 pb-10 sm:pt-24 sm:pb-14">
				<motion.img
					alt=""
					animate={{ scale: 1.25, opacity: 1 }}
					className="pointer-events-none absolute inset-0 h-full w-full object-cover"
					height={BANNER_IMAGE_HEIGHT}
					initial={{ scale: 1.4, opacity: 0 }}
					src={BANNER_IMAGE_SRC}
					transition={{ duration: 1.2, ease: "easeOut" }}
					width={BANNER_IMAGE_WIDTH}
				/>
				<div className="pointer-events-none absolute inset-0 bg-black/50" />
				<div className="relative mx-auto max-w-4xl">
					<motion.div
						animate={{ opacity: 1 }}
						initial={{ opacity: 0 }}
						transition={{ duration: 0.4, delay: 0.2 }}
					>
						<Link
							className="mb-8 block text-white text-xs uppercase tracking-[0.2em] transition-opacity hover:opacity-70"
							search={{ page: 1, pageSize: DEFAULT_PAGE_SIZE }}
							to="/projects"
						>
							&larr; back to projects
						</Link>
					</motion.div>
					<motion.h1
						animate={{ opacity: 1, y: 0 }}
						className="font-pixel-square text-[clamp(2rem,6vw,4rem)] leading-[0.95] tracking-tight"
						initial={{ opacity: 0, y: 20 }}
						transition={{ duration: 0.5, delay: 0.3 }}
					>
						{project.title}
					</motion.h1>
				</div>
			</section>

			<motion.section
				animate={{ opacity: 1 }}
				className="bg-white px-6 py-10 text-black sm:py-16"
				initial={{ opacity: 0 }}
				transition={{ duration: 0.5, delay: 0.15 }}
			>
				<div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2">
					<div>
						<span className="mb-3 block font-pixel-square text-neutral-500 text-xs uppercase">
							{project.tag}
						</span>
						<h2 className="mb-4 font-pixel-square text-xl leading-tight tracking-tight sm:text-2xl">
							{project.title}
						</h2>
						{project.description && (
							<p className="whitespace-pre-line text-neutral-500 text-sm leading-relaxed">
								{project.description}
							</p>
						)}
						{(project.githubUrl || project.liveUrl) && (
							<div className="mt-6 flex gap-3">
								{project.githubUrl && (
									<a
										className="border border-neutral-300 px-4 py-2 font-pixel-square text-[10px] text-neutral-600 uppercase tracking-[0.15em] transition-colors hover:border-black hover:text-black"
										href={project.githubUrl}
										rel="noopener noreferrer"
										target="_blank"
									>
										github &rarr;
									</a>
								)}
								{project.liveUrl && (
									<a
										className="border border-neutral-300 px-4 py-2 font-pixel-square text-[10px] text-neutral-600 uppercase tracking-[0.15em] transition-colors hover:border-black hover:text-black"
										href={project.liveUrl}
										rel="noopener noreferrer"
										target="_blank"
									>
										live &rarr;
									</a>
								)}
							</div>
						)}
					</div>
					<div>
						{project.coverImage ? (
							<img
								alt={project.title}
								className="mb-5 rounded-2xl object-cover"
								height={PROJECT_COVER_IMAGE_SIZE}
								loading="lazy"
								src={project.coverImage}
								style={{
									height: PROJECT_COVER_IMAGE_SIZE,
									width: PROJECT_COVER_IMAGE_SIZE,
								}}
								width={PROJECT_COVER_IMAGE_SIZE}
							/>
						) : (
							<div
								className="mb-5 flex items-center justify-center rounded-2xl bg-neutral-100"
								style={{
									height: PROJECT_COVER_IMAGE_SIZE,
									width: PROJECT_COVER_IMAGE_SIZE,
								}}
							>
								<span className="font-pixel-square text-neutral-400 text-xs uppercase tracking-wider">
									No image available
								</span>
							</div>
						)}
						{project.stack.length > 0 && (
							<div className="flex flex-wrap gap-1.5">
								{project.stack.map((s) => (
									<span
										className="border border-neutral-200 px-2.5 py-1 text-[10px] text-neutral-400 uppercase tracking-wider"
										key={s}
									>
										{s}
									</span>
								))}
							</div>
						)}
					</div>
				</div>
			</motion.section>
			<SiteFooter />
		</div>
	);
}
