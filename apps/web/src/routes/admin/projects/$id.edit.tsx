import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";

import ImageDropzone from "@/components/image-dropzone";
import Loader from "@/components/loader";
import { DESCRIPTION_TEXTAREA_ROWS } from "@/lib/constants";
import { queryClient, trpc, trpcClient } from "@/utils/trpc";

export const Route = createFileRoute("/admin/projects/$id/edit")({
	component: EditProjectComponent,
	loader: ({ context: { queryClient }, params: { id } }) =>
		queryClient.ensureQueryData(trpc.project.getById.queryOptions({ id })),
});

function EditProjectComponent() {
	const { id } = Route.useParams();
	const navigate = useNavigate();

	const { data: project, isLoading } = useQuery(
		trpc.project.getById.queryOptions({ id })
	);

	const updateMutation = useMutation({
		mutationFn: (input: {
			id: string;
			title?: string;
			slug?: string;
			description?: string;
			tag?: string;
			stack?: string[];
			githubUrl?: string;
			liveUrl?: string;
			coverImage?: string;
		}) => trpcClient.project.update.mutate(input),
		onSuccess: () => {
			toast.success("Project updated");
			queryClient.invalidateQueries({
				queryKey: [["project"]],
			});
			navigate({ to: "/admin/projects" });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	if (isLoading || !project) {
		return <Loader />;
	}

	return (
		<EditProjectForm
			navigate={navigate}
			onUpdate={updateMutation}
			project={project}
		/>
	);
}

interface ProjectData {
	id: string;
	title: string;
	slug: string;
	description: string | null;
	tag: string;
	stack: string[];
	githubUrl: string | null;
	liveUrl: string | null;
	coverImage: string | null;
}

function EditProjectForm({
	project,
	onUpdate,
	navigate,
}: {
	project: ProjectData;
	onUpdate: {
		mutateAsync: (input: {
			id: string;
			title?: string;
			slug?: string;
			description?: string;
			tag?: string;
			stack?: string[];
			githubUrl?: string;
			liveUrl?: string;
			coverImage?: string;
		}) => Promise<unknown>;
		isPending: boolean;
	};
	navigate: ReturnType<typeof useNavigate>;
}) {
	const form = useForm({
		defaultValues: {
			title: project.title,
			slug: project.slug,
			description: project.description ?? "",
			tag: project.tag,
			stack: project.stack.join(", "),
			githubUrl: project.githubUrl ?? "",
			liveUrl: project.liveUrl ?? "",
			coverImage: project.coverImage ?? "",
		},
		onSubmit: async ({ value }) => {
			const stack = value.stack
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean);

			await onUpdate.mutateAsync({
				id: project.id,
				title: value.title,
				slug: value.slug,
				tag: value.tag,
				stack,
				description: value.description || undefined,
				githubUrl: value.githubUrl || undefined,
				liveUrl: value.liveUrl || undefined,
				coverImage: value.coverImage || undefined,
			});
		},
		validators: {
			onSubmit: z.object({
				title: z.string().min(1, "Title is required"),
				slug: z.string().min(1, "Slug is required"),
				description: z.string(),
				tag: z.string().min(1, "Tag is required"),
				stack: z.string(),
				githubUrl: z.string(),
				liveUrl: z.string(),
				coverImage: z.string(),
			}),
		},
	});

	return (
		<div className="px-8 py-10">
			<h1 className="mb-8 font-pixel-square text-xl leading-[0.85] tracking-tight sm:text-3xl">
				EDIT PROJECT
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
							<textarea
								className="min-h-[120px] w-full resize-y border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-500"
								id={field.name}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="Describe the project in detail"
								rows={DESCRIPTION_TEXTAREA_ROWS}
								value={field.state.value}
							/>
						</div>
					)}
				</form.Field>

				<div className="grid grid-cols-2 gap-4">
					<form.Field name="tag">
						{(field) => (
							<div className="space-y-2">
								<label
									className="font-pixel-square text-neutral-500 text-xs uppercase"
									htmlFor={field.name}
								>
									Tag
								</label>
								<input
									className="h-9 w-full border border-neutral-200 bg-transparent px-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-500"
									id={field.name}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="e.g. web, cli, library"
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

					<form.Field name="stack">
						{(field) => (
							<div className="space-y-2">
								<label
									className="font-pixel-square text-neutral-500 text-xs uppercase"
									htmlFor={field.name}
								>
									Stack
								</label>
								<input
									className="h-9 w-full border border-neutral-200 bg-transparent px-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-500"
									id={field.name}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="React, TypeScript, Node"
									value={field.state.value}
								/>
								<p className="text-neutral-400 text-xs">
									Comma-separated list.
								</p>
							</div>
						)}
					</form.Field>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<form.Field name="githubUrl">
						{(field) => (
							<div className="space-y-2">
								<label
									className="font-pixel-square text-neutral-500 text-xs uppercase"
									htmlFor={field.name}
								>
									GitHub URL
								</label>
								<input
									className="h-9 w-full border border-neutral-200 bg-transparent px-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-500"
									id={field.name}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="https://github.com/..."
									value={field.state.value}
								/>
							</div>
						)}
					</form.Field>

					<form.Field name="liveUrl">
						{(field) => (
							<div className="space-y-2">
								<label
									className="font-pixel-square text-neutral-500 text-xs uppercase"
									htmlFor={field.name}
								>
									Live URL
								</label>
								<input
									className="h-9 w-full border border-neutral-200 bg-transparent px-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-500"
									id={field.name}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="https://example.com"
									value={field.state.value}
								/>
							</div>
						)}
					</form.Field>
				</div>

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
						onClick={() => navigate({ to: "/admin/projects" })}
						type="button"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}
