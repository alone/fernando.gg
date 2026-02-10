import { ClockIcon } from "@phosphor-icons/react/dist/csr/Clock";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

import { Markdown } from "@/components/markdown";
import SiteFooter from "@/components/site-footer";
import {
	BANNER_IMAGE_HEIGHT,
	BANNER_IMAGE_SRC,
	BANNER_IMAGE_WIDTH,
	META_ICON_SIZE,
	MIN_READ_TIME_MINUTES,
	READING_WORDS_PER_MINUTE,
} from "@/lib/constants";
import { formatDate } from "@/lib/format-date";
import { trpc } from "@/utils/trpc";

const WORD_SPLIT = /\s+/;

function estimateReadTime(content: string): string {
	const words = content.trim().split(WORD_SPLIT).length;
	const minutes = Math.max(
		MIN_READ_TIME_MINUTES,
		Math.round(words / READING_WORDS_PER_MINUTE)
	);
	return `${minutes} min read`;
}

export const Route = createFileRoute("/blog/$slug")({
	component: BlogPostComponent,
	loader: ({ context: { queryClient }, params: { slug } }) =>
		queryClient.ensureQueryData(trpc.blog.getBySlug.queryOptions({ slug })),
});

function BlogPostComponent() {
	const { slug } = Route.useParams();
	const {
		data: post,
		isPending,
		error,
	} = useQuery(trpc.blog.getBySlug.queryOptions({ slug }));

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
						<div className="mb-8 h-3 w-24 bg-neutral-700/50" />
						<div className="mb-4 h-[clamp(2rem,6vw,4rem)] w-3/4 bg-neutral-700/50" />
						<div className="mb-4 h-5 w-1/2 bg-neutral-700/40" />
						<div className="flex items-center justify-between">
							<div className="h-3 w-32 bg-neutral-700/40" />
							<div className="h-6 w-24 bg-neutral-700/40" />
						</div>
					</div>
				</section>

				<section className="bg-white px-6 py-10 sm:py-16">
					<div className="mx-auto max-w-4xl animate-pulse space-y-4">
						<div className="h-4 w-full bg-neutral-200" />
						<div className="h-4 w-5/6 bg-neutral-200" />
						<div className="h-4 w-full bg-neutral-200" />
						<div className="h-4 w-4/6 bg-neutral-200" />
						<div className="mt-6 h-4 w-full bg-neutral-200" />
						<div className="h-4 w-3/4 bg-neutral-200" />
						<div className="h-4 w-5/6 bg-neutral-200" />
					</div>
				</section>

				<SiteFooter />
			</div>
		);
	}

	if (error || !post) {
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
								to="/blog"
							>
								&larr; back to blog
							</Link>
						</motion.div>
						<motion.h1
							animate={{ opacity: 1, y: 0 }}
							className="font-pixel-square text-[clamp(3rem,10vw,7rem)] leading-[0.9] tracking-tight"
							initial={{ opacity: 0, y: 30 }}
							transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
						>
							BLOG
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
								Post not found
							</span>
							<p className="mx-auto max-w-xs text-neutral-400 text-sm leading-relaxed">
								The post you're looking for doesn't exist or has been removed.
							</p>
							<Link
								className="mt-6 inline-block border border-neutral-300 px-6 py-3 text-black text-xs uppercase tracking-[0.2em] transition-colors hover:bg-black hover:text-white"
								to="/blog"
							>
								<span className="font-pixel-square leading-[0.85] tracking-tight">
									Back to blog
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
							to="/blog"
						>
							&larr; back to blog
						</Link>
					</motion.div>
					<motion.h1
						animate={{ opacity: 1 }}
						className="mb-4 font-pixel-square text-[clamp(2rem,6vw,4rem)] leading-[0.95] tracking-tight"
						initial={{ opacity: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
					>
						{post.title}
					</motion.h1>
					{post.description && (
						<motion.p
							animate={{ opacity: 1 }}
							className="mb-4 max-w-lg text-base text-neutral-400 leading-relaxed"
							initial={{ opacity: 0 }}
							transition={{ duration: 0.4, delay: 0.45 }}
						>
							{post.description}
						</motion.p>
					)}
					<motion.div
						animate={{ opacity: 1 }}
						className="flex items-center justify-between text-xs uppercase tracking-[0.2em]"
						initial={{ opacity: 0 }}
						transition={{ duration: 0.4, delay: 0.55 }}
					>
						<time className="text-neutral-400">
							{post.publishedAt ? formatDate(post.publishedAt, "long") : ""}
						</time>
						<span className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 text-[10px] text-black tracking-wider">
							<ClockIcon size={META_ICON_SIZE} weight="bold" />
							{estimateReadTime(post.content)}
						</span>
					</motion.div>
				</div>
			</section>

			<motion.section
				animate={{ opacity: 1 }}
				className="bg-white px-6 py-10 text-black sm:py-16"
				initial={{ opacity: 0 }}
				transition={{ duration: 0.5, delay: 0.15 }}
			>
				<div className="mx-auto max-w-4xl">
					<Markdown
						className="prose-neutral prose-headings:font-pixel-square prose-a:text-black prose-headings:tracking-tight prose-a:underline-offset-2"
						content={post.content}
					/>
				</div>
			</motion.section>

			<SiteFooter />
		</div>
	);
}
