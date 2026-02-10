import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

import SiteFooter from "@/components/site-footer";
import {
	BANNER_IMAGE_HEIGHT,
	BANNER_IMAGE_SRC,
	BANNER_IMAGE_WIDTH,
} from "@/lib/constants";
import { formatDate } from "@/lib/format-date";
import { trpc } from "@/utils/trpc";

export const Route = createFileRoute("/blog/")({
	component: BlogListComponent,
	loader: ({ context: { queryClient } }) =>
		queryClient.ensureQueryData(trpc.blog.list.queryOptions()),
});

function PostList({
	posts,
}: {
	posts: {
		id: string;
		slug: string;
		title: string;
		description: string | null;
		publishedAt: string | null;
	}[];
}) {
	return (
		<div className="space-y-4">
			{posts.map((post, i) => (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					key={post.id}
					transition={{ duration: 0.45, delay: i * 0.08 }}
					viewport={{ once: true }}
					whileInView={{ opacity: 1, y: 0 }}
				>
					<Link
						className="block border border-neutral-200 p-5 transition-colors hover:bg-neutral-50"
						params={{ slug: post.slug }}
						to="/blog/$slug"
					>
						<span className="mb-2 block text-neutral-400 text-xs uppercase">
							{post.publishedAt ? formatDate(post.publishedAt) : "Draft"}
						</span>
						<span className="mb-2 block font-pixel-square text-base">
							{post.title}
						</span>
						{post.description && (
							<span className="block text-neutral-500 text-sm leading-relaxed">
								{post.description}
							</span>
						)}
					</Link>
				</motion.div>
			))}
		</div>
	);
}

function BlogListComponent() {
	const { data: posts, isLoading } = useQuery(trpc.blog.list.queryOptions());

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
						BLOG
					</motion.h1>
				</div>
			</section>

			<section className="bg-white px-6 py-10 text-black sm:py-16">
				<div className="mx-auto max-w-4xl">
					{isLoading && (
						<div className="space-y-4">
							{["s1", "s2", "s3"].map((key) => (
								<div
									className="animate-pulse border border-neutral-200 p-5"
									key={key}
								>
									<div className="mb-3 h-3 w-16 bg-neutral-200" />
									<div className="mb-2 h-5 w-2/3 bg-neutral-200" />
									<div className="h-4 w-full bg-neutral-100" />
								</div>
							))}
						</div>
					)}
					{!isLoading && (!posts || posts.length === 0) && (
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
								Posts are on their way. Check back soon or head home in the
								meantime.
							</p>
							<Link
								className="mt-6 inline-block border border-neutral-300 px-6 py-3 text-black text-xs uppercase tracking-[0.2em] transition-colors hover:bg-black hover:text-white"
								to="/"
							>
								<span className="font-pixel-square leading-[0.85] tracking-tight">
									Back home
								</span>
							</Link>
						</motion.div>
					)}
					{!isLoading && posts && posts.length > 0 && (
						<PostList posts={posts} />
					)}
				</div>
			</section>

			<SiteFooter />
		</div>
	);
}
