import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";

import ImageDropzone from "@/components/image-dropzone";
import Loader from "@/components/loader";
import { queryClient, trpc, trpcClient } from "@/utils/trpc";

export const Route = createFileRoute("/admin/blog/$id/edit")({
	component: EditPostComponent,
	loader: ({ context: { queryClient }, params: { id } }) =>
		queryClient.ensureQueryData(trpc.blog.getById.queryOptions({ id })),
});

function EditPostComponent() {
	const { id } = Route.useParams();
	const navigate = useNavigate();

	const { data: post, isLoading } = useQuery(
		trpc.blog.getById.queryOptions({ id })
	);

	const updateMutation = useMutation({
		mutationFn: (input: {
			id: string;
			title?: string;
			slug?: string;
			description?: string;
			githubPath?: string;
			coverImage?: string;
		}) => trpcClient.blog.update.mutate(input),
		onSuccess: () => {
			toast.success("Post updated");
			queryClient.invalidateQueries({
				queryKey: [["blog"]],
			});
			navigate({ to: "/admin/blog" });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	if (isLoading || !post) {
		return <Loader />;
	}

	return (
		<EditPostForm navigate={navigate} onUpdate={updateMutation} post={post} />
	);
}

interface PostData {
	id: string;
	title: string;
	slug: string;
	description: string | null;
	githubPath: string;
	coverImage: string | null;
}

function EditPostForm({
	post,
	onUpdate,
	navigate,
}: {
	post: PostData;
	onUpdate: {
		mutateAsync: (input: {
			id: string;
			title?: string;
			slug?: string;
			description?: string;
			githubPath?: string;
			coverImage?: string;
		}) => Promise<unknown>;
		isPending: boolean;
	};
	navigate: ReturnType<typeof useNavigate>;
}) {
	const form = useForm({
		defaultValues: {
			title: post.title,
			slug: post.slug,
			description: post.description ?? "",
			githubPath: post.githubPath,
			coverImage: post.coverImage ?? "",
		},
		onSubmit: async ({ value }) => {
			await onUpdate.mutateAsync({
				id: post.id,
				title: value.title,
				slug: value.slug,
				description: value.description || undefined,
				githubPath: value.githubPath,
				coverImage: value.coverImage || undefined,
			});
		},
		validators: {
			onSubmit: z.object({
				title: z.string().min(1, "Title is required"),
				slug: z.string().min(1, "Slug is required"),
				description: z.string(),
				githubPath: z.string().min(1, "GitHub path is required"),
				coverImage: z.string(),
			}),
		},
	});

	return (
		<div className="px-8 py-10">
			<h1 className="mb-8 font-pixel-square text-xl leading-[0.85] tracking-tight sm:text-3xl">
				EDIT POST
			</h1>

			<form
				className="space-y-5"
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				<form.Field name="title">
					{(field) => (
						<div className="space-y-2">
							<label
								className="font-pixel-square text-neutral-500 text-xs uppercase"
								htmlFor={field.name}
							>
								Title
							</label>
							<input
								className="h-9 w-full border border-neutral-200 bg-transparent px-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-500"
								id={field.name}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								value={field.state.value}
							/>
							{field.state.meta.errors.map((error) => (
								<p className="text-red-500 text-xs" key={error?.message}>
									{error?.message}
								</p>
							))}
						</div>
					)}
				</form.Field>

				<form.Field name="slug">
					{(field) => (
						<div className="space-y-2">
							<label
								className="font-pixel-square text-neutral-500 text-xs uppercase"
								htmlFor={field.name}
							>
								Slug
							</label>
							<input
								className="h-9 w-full border border-neutral-200 bg-transparent px-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-500"
								id={field.name}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								value={field.state.value}
							/>
							{field.state.meta.errors.map((error) => (
								<p className="text-red-500 text-xs" key={error?.message}>
									{error?.message}
								</p>
							))}
						</div>
					)}
				</form.Field>

				<form.Field name="description">
					{(field) => (
						<div className="space-y-2">
							<label
								className="font-pixel-square text-neutral-500 text-xs uppercase"
								htmlFor={field.name}
							>
								Description
							</label>
							<input
								className="h-9 w-full border border-neutral-200 bg-transparent px-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-500"
								id={field.name}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="Brief description of the post"
								value={field.state.value}
							/>
						</div>
					)}
				</form.Field>

				<form.Field name="githubPath">
					{(field) => (
						<div className="space-y-2">
							<label
								className="font-pixel-square text-neutral-500 text-xs uppercase"
								htmlFor={field.name}
							>
								GitHub Path
							</label>
							<input
								className="h-9 w-full border border-neutral-200 bg-transparent px-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-500"
								id={field.name}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="posts/my-post.md"
								value={field.state.value}
							/>
							<p className="text-neutral-400 text-xs">
								Path to the markdown file in the GitHub repository.
							</p>
							{field.state.meta.errors.map((error) => (
								<p className="text-red-500 text-xs" key={error?.message}>
									{error?.message}
								</p>
							))}
						</div>
					)}
				</form.Field>

				<form.Field name="coverImage">
					{(field) => (
						<div className="space-y-2">
							<span className="font-pixel-square text-neutral-500 text-xs uppercase">
								Cover Image
							</span>
							<ImageDropzone
								onChange={(val) => field.handleChange(val)}
								value={field.state.value}
							/>
						</div>
					)}
				</form.Field>

				<div className="flex gap-3 border-neutral-200 border-t pt-6">
					<form.Subscribe>
						{(state) => (
							<button
								className="border border-black bg-black px-5 py-2.5 font-pixel-square text-white text-xs uppercase tracking-[0.2em] transition-colors hover:bg-transparent hover:text-black disabled:pointer-events-none disabled:opacity-40"
								disabled={!state.canSubmit || state.isSubmitting}
								type="submit"
							>
								{state.isSubmitting ? "Saving..." : "Save Changes"}
							</button>
						)}
					</form.Subscribe>
					<button
						className="border border-neutral-200 px-5 py-2.5 font-pixel-square text-xs uppercase tracking-[0.2em] transition-colors hover:bg-neutral-50"
						onClick={() => navigate({ to: "/admin/blog" })}
						type="button"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}
