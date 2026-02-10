import { CloudArrowUpIcon } from "@phosphor-icons/react/dist/csr/CloudArrowUp";
import { SpinnerIcon } from "@phosphor-icons/react/dist/csr/Spinner";
import { TrashIcon } from "@phosphor-icons/react/dist/csr/Trash";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import {
	COVER_IMAGE_PREVIEW_HEIGHT,
	COVER_IMAGE_PREVIEW_WIDTH,
	MAX_IMAGE_FILE_SIZE_BYTES,
} from "@/lib/constants";
import { trpcClient } from "@/utils/trpc";

interface ImageDropzoneProps {
	value: string;
	onChange: (value: string) => void;
}

export default function ImageDropzone({ value, onChange }: ImageDropzoneProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [dragging, setDragging] = useState(false);
	const [uploading, setUploading] = useState(false);

	const handleFile = useCallback(
		async (file: File) => {
			if (!file.type.startsWith("image/")) {
				toast.error("Only image files are allowed.");
				return;
			}

			if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
				toast.error(
					`File is too large. Maximum size is ${MAX_IMAGE_FILE_SIZE_BYTES / 1024 / 1024}MB.`
				);
				return;
			}

			const base64 = await new Promise<string>((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => {
					const result = reader.result as string;
					const base64Data = result.split(",")[1];
					if (base64Data) {
						resolve(base64Data);
					} else {
						reject(new Error("Failed to read file"));
					}
				};
				reader.onerror = () => reject(reader.error);
				reader.readAsDataURL(file);
			});

			setUploading(true);
			try {
				const { url } = await trpcClient.upload.image.mutate({
					base64,
					mimeType: file.type as
						| "image/png"
						| "image/jpeg"
						| "image/gif"
						| "image/webp",
				});
				onChange(url);
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : "Upload failed";
				toast.error(message);
			} finally {
				setUploading(false);
			}
		},
		[onChange]
	);

	function handleDrop(e: React.DragEvent) {
		e.preventDefault();
		setDragging(false);
		const file = e.dataTransfer.files[0];
		if (file) {
			handleFile(file);
		}
	}

	function handleDragOver(e: React.DragEvent) {
		e.preventDefault();
		setDragging(true);
	}

	function handleDragLeave() {
		setDragging(false);
	}

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (file) {
			handleFile(file);
		}
	}

	if (value) {
		return (
			<div className="group relative border border-neutral-200">
				<img
					alt="Cover preview"
					className="h-48 w-full object-cover"
					height={COVER_IMAGE_PREVIEW_HEIGHT}
					src={value}
					width={COVER_IMAGE_PREVIEW_WIDTH}
				/>
				<button
					className="absolute top-2 right-2 border border-neutral-200 bg-white p-1.5 text-neutral-400 transition-colors hover:border-red-200 hover:text-red-500"
					onClick={() => onChange("")}
					type="button"
				>
					<TrashIcon className="size-4" weight="thin" />
				</button>
			</div>
		);
	}

	if (uploading) {
		return (
			<div className="flex w-full flex-col items-center justify-center border border-neutral-300 border-dashed py-10">
				<SpinnerIcon
					className="mb-3 size-8 animate-spin text-neutral-400"
					weight="thin"
				/>
				<p className="font-pixel-square text-neutral-400 text-xs uppercase">
					Uploading...
				</p>
			</div>
		);
	}

	return (
		<button
			className={`flex w-full flex-col items-center justify-center border border-dashed py-10 transition-colors ${
				dragging
					? "border-black bg-neutral-50"
					: "border-neutral-300 hover:border-neutral-400"
			}`}
			onClick={() => inputRef.current?.click()}
			onDragLeave={handleDragLeave}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
			type="button"
		>
			<CloudArrowUpIcon
				className="mb-3 size-8 text-neutral-300"
				weight="thin"
			/>
			<p className="font-pixel-square text-neutral-400 text-xs uppercase">
				<span className="text-black">Click to upload</span> or drag and drop
			</p>
			<p className="mt-1 text-[10px] text-neutral-400">
				PNG, JPG, GIF, SVG or WEBP (max 5MB)
			</p>
			<input
				accept="image/*"
				className="hidden"
				onChange={handleInputChange}
				ref={inputRef}
				type="file"
			/>
		</button>
	);
}
