import { format } from "date-fns";

export function formatDate(
	date: string | Date,
	style: "short" | "long" | "default" = "default"
) {
	const d = typeof date === "string" ? new Date(date) : date;
	switch (style) {
		case "short":
			return format(d, "MMM yyyy");
		case "long":
			return format(d, "MMMM d, yyyy");
		default:
			return format(d, "MMM d, yyyy");
	}
}
