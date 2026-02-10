import { TRPCError } from "@trpc/server";

const PG_UNIQUE_VIOLATION = "23505";

export function isUniqueViolation(err: unknown): boolean {
	return (
		err instanceof Error &&
		"code" in err &&
		(err as Record<string, unknown>).code === PG_UNIQUE_VIOLATION
	);
}

export function throwConflict(message: string): never {
	throw new TRPCError({ code: "CONFLICT", message });
}
