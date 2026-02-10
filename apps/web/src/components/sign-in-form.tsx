import { EyeIcon } from "@phosphor-icons/react/dist/csr/Eye";
import { EyeClosedIcon } from "@phosphor-icons/react/dist/csr/EyeClosed";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import { MIN_PASSWORD_LENGTH } from "@/lib/constants";
import Loader from "./loader";

export default function SignInForm() {
	const navigate = useNavigate({
		from: "/",
	});
	const { isPending } = authClient.useSession();
	const [showPassword, setShowPassword] = useState(false);

	const form = useForm({
		defaultValues: {
			username: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			await authClient.signIn.username(
				{
					username: value.username,
					password: value.password,
				},
				{
					onSuccess: () => {
						navigate({
							to: "/admin",
						});
						toast.success("Sign in successful");
					},
					onError: (error) => {
						toast.error(error.error.message || error.error.statusText);
					},
				}
			);
		},
		validators: {
			onSubmit: z.object({
				username: z.string().min(1, "Username is required"),
				password: z
					.string()
					.min(
						MIN_PASSWORD_LENGTH,
						`Password must be at least ${MIN_PASSWORD_LENGTH} characters`
					),
			}),
		},
	});

	if (isPending) {
		return <Loader />;
	}

	return (
		<form
			className="space-y-5"
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<motion.div
				animate={{ opacity: 1, y: 0 }}
				initial={{ opacity: 0, y: 15 }}
				transition={{ duration: 0.4, delay: 0.1 }}
			>
				<form.Field name="username">
					{(field) => (
						<div className="space-y-2">
							<label
								className="font-pixel-square text-neutral-500 text-xs uppercase"
								htmlFor={field.name}
							>
								Username
							</label>
							<input
								autoComplete="off"
								className="h-9 w-full border border-neutral-200 bg-transparent px-3 text-black text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-500"
								id={field.name}
								name={field.name}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="admin"
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
			</motion.div>

			<motion.div
				animate={{ opacity: 1, y: 0 }}
				initial={{ opacity: 0, y: 15 }}
				transition={{ duration: 0.4, delay: 0.2 }}
			>
				<form.Field name="password">
					{(field) => (
						<div className="space-y-2">
							<label
								className="font-pixel-square text-neutral-500 text-xs uppercase"
								htmlFor={field.name}
							>
								Password
							</label>
							<div className="relative">
								<input
									className="h-9 w-full border border-neutral-200 bg-transparent px-3 pr-9 text-black text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-500"
									id={field.name}
									name={field.name}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="••••••••"
									type={showPassword ? "text" : "password"}
									value={field.state.value}
								/>
								<button
									className="absolute top-1/2 right-2.5 -translate-y-1/2 text-neutral-400 transition-colors hover:text-black"
									onClick={() => setShowPassword(!showPassword)}
									tabIndex={-1}
									type="button"
								>
									{showPassword ? (
										<EyeClosedIcon className="size-4" weight="thin" />
									) : (
										<EyeIcon className="size-4" weight="thin" />
									)}
								</button>
							</div>
							{field.state.meta.errors.map((error) => (
								<p className="text-red-500 text-xs" key={error?.message}>
									{error?.message}
								</p>
							))}
						</div>
					)}
				</form.Field>
			</motion.div>

			<motion.div
				animate={{ opacity: 1 }}
				initial={{ opacity: 0 }}
				transition={{ duration: 0.4, delay: 0.3 }}
			>
				<form.Subscribe>
					{(state) => (
						<button
							className="mt-2 w-full border border-black bg-black px-6 py-3 font-pixel-square text-white text-xs uppercase tracking-[0.2em] transition-colors hover:bg-transparent hover:text-black disabled:pointer-events-none disabled:opacity-40"
							disabled={!state.canSubmit || state.isSubmitting}
							type="submit"
						>
							{state.isSubmitting ? "Signing in..." : "Sign in"}
						</button>
					)}
				</form.Subscribe>
			</motion.div>
		</form>
	);
}
