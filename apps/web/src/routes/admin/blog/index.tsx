import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";

import { formatDate } from "@/lib/format-date";
import { queryClient, trpc, trpcClient } from "@/utils/trpc";

export const Route = createFileRoute("/admin/blog/")({
	component: AdminBlogList,
	loader: ({ context: { queryClient } }) =>
		queryClient.ensureQueryData(trpc.blog.listAll.queryOptions()),
});

function AdminBlogList() {
	const { data: posts, isLoading } = useQuery(trpc.blog.listAll.queryOptions());

	const deleteMutation = useMutation({
		mutationFn: (id: string) => trpcClient.blog.delete.mutate({ id }),
		onSuccess: () => {
			toast.success("Post deleted");
			queryClient.invalidateQueries({
				queryKey: [["blog"]],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	function handleDelete(postId: string) {
		deleteMutation.mutate(postId);
	}

	if (isLoading) {
		return (
			<div className="px-8 py-10">
				<div className="mb-8 flex items-center justify-between">
					<h1 className="font-pixel-square text-xl leading-[0.85] tracking-tight sm:text-3xl">
						BLOG POSTS
					</h1>
					<Link to="/admin/blog/new">
						<span className="inline-block border border-black bg-black px-3 py-2 font-pixel-square text-[10px] text-white uppercase tracking-[0.2em] transition-colors hover:bg-transparent hover:text-black sm:px-5 sm:py-2.5 sm:text-xs">
							New Post
						</span>
					</Link>
				</div>
				<div className="space-y-3">
					{["skeleton-1", "skeleton-2", "skeleton-3"].map((key) => (
						<div
							className="animate-pulse border border-neutral-200 p-5"
							key={key}
						>
							<div className="h-4 w-1/2 bg-neutral-100" />
							<div className="mt-3 h-3 w-1/4 bg-neutral-100" />
						</div>
					))}
				</div>
			</div>
		);
	}

	if (!posts || posts.length === 0) {
		return (
			<div className="px-8 py-10">
				<div className="mb-8 flex items-center justify-between">
					<h1 className="font-pixel-square text-xl leading-[0.85] tracking-tight sm:text-3xl">
						BLOG POSTS
					</h1>
					<Link to="/admin/blog/new">
						<span className="inline-block border border-black bg-black px-3 py-2 font-pixel-square text-[10px] text-white uppercase tracking-[0.2em] transition-colors hover:bg-transparent hover:text-black sm:px-5 sm:py-2.5 sm:text-xs">
							New Post
						</span>
					</Link>
				</div>
				<div className="border border-neutral-200 border-dashed p-8 text-center">
					<p className="text-neutral-400 text-sm">
						No posts yet. Create your first one.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="px-8 py-10">
			<div className="mb-8 flex items-center justify-between">
				<h1 className="font-pixel-square text-xl leading-[0.85] tracking-tight sm:text-3xl">
					BLOG POSTS
				</h1>
				<Link to="/admin/blog/new">
					<span className="inline-block border border-black bg-black px-3 py-2 font-pixel-square text-[10px] text-white uppercase tracking-[0.2em] transition-colors hover:bg-transparent hover:text-black sm:px-5 sm:py-2.5 sm:text-xs">
						New Post
					</span>
				</Link>
			</div>

			<div className="space-y-3">
				{posts.map((post) => (
					<div
						className="flex items-center justify-between border border-neutral-200 p-5"
						key={post.id}
					>
						<div className="min-w-0 flex-1">
							<div className="flex items-center gap-3">
								<h2 className="truncate font-pixel-square text-sm">
									{post.title}
								</h2>
							</div>
							<p className="mt-1 text-neutral-400 text-xs">
								{post.slug} &middot; {formatDate(post.createdAt)}
							</p>
						</div>
						<div className="ml-4 flex shrink-0 items-center gap-2">
							<Link params={{ id: post.id }} to="/admin/blog/$id/edit">
								<span className="inline-block border border-neutral-200 px-3 py-1.5 text-xs uppercase tracking-wider transition-colors hover:bg-neutral-50">
									Edit
								</span>
							</Link>
							<button
								className="border border-red-200 px-3 py-1.5 text-red-500 text-xs uppercase tracking-wider transition-colors hover:bg-red-50 disabled:opacity-40"
								disabled={deleteMutation.isPending}
								onClick={() => handleDelete(post.id)}
								type="button"
							>
								Delete
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
