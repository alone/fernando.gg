import { CheckCircleIcon } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { InfoIcon } from "@phosphor-icons/react/dist/csr/Info";
import { SpinnerIcon } from "@phosphor-icons/react/dist/csr/Spinner";
import { WarningIcon } from "@phosphor-icons/react/dist/csr/Warning";
import { XCircleIcon } from "@phosphor-icons/react/dist/csr/XCircle";
import type { ToasterProps } from "sonner";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
	return (
		<Sonner
			className="toaster group"
			icons={{
				success: <CheckCircleIcon className="size-4" weight="thin" />,
				info: <InfoIcon className="size-4" weight="thin" />,
				warning: <WarningIcon className="size-4" weight="thin" />,
				error: <XCircleIcon className="size-4" weight="thin" />,
				loading: <SpinnerIcon className="size-4 animate-spin" weight="thin" />,
			}}
			style={
				{
					"--normal-bg": "#ffffff",
					"--normal-text": "#000000",
					"--normal-border": "#e5e5e5",
					"--border-radius": "0px",
				} as React.CSSProperties
			}
			toastOptions={{
				classNames: {
					toast: "!font-sans !shadow-none !border !border-neutral-200",
					title: "!font-pixel-square !text-xs !uppercase !tracking-wider",
					description: "!text-neutral-500 !text-xs",
					success: "!border-green-300 !text-green-700",
					error: "!border-red-300 !text-red-600",
					warning: "!border-yellow-300 !text-yellow-700",
					info: "!border-neutral-300 !text-black",
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
