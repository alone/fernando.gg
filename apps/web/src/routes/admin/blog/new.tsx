import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";

import ImageDropzone from "@/components/image-dropzone";
import { queryClient, trpcClient } from "@/utils/trpc";

export const Route = createFileRoute("/admin/blog/new")({
	component: NewPostComponent,
});

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.trim();
}

function NewPostComponent() {
	const navigate = useNavigate();

	const createMutation = useMutation({
		mutationFn: (input: {
			title: string;
			slug: string;
			description?: string;
			githubPath: string;
			coverImage?: string;
		}) => trpcClient.blog.create.mutate(input),
		onSuccess: () => {
			toast.success("Post created");
			queryClient.invalidateQueries({
				queryKey: [["blog"]],
			});
			navigate({ to: "/admin/blog" });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const form = useForm({
		defaultValues: {
			title: "",
			slug: "",
			description: "",
			githubPath: "",
			coverImage: "",
		},
		onSubmit: async ({ value }) => {
			await createMutation.mutateAsync({
				title: value.title,
				slug: value.slug,
				githubPath: value.githubPath,
				description: value.description || undefined,
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
				NEW POST
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
								onChange={(e) => {
									field.handleChange(e.target.value);
									const currentSlug = form.getFieldValue("slug");
									const prevTitle = field.state.value;
									if (
										currentSlug === "" ||
										currentSlug === slugify(prevTitle)
									) {
										form.setFieldValue("slug", slugify(e.target.value));
									}
								}}
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
								placeholder="auto-generated-from-title"
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
								{state.isSubmitting ? "Creating..." : "Create Post"}
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
