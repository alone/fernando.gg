import { auth } from "@fernando/auth";

type Session = Awaited<ReturnType<typeof auth.api.getSession>>;

export interface CreateContextOptions {
	req: Request;
}

export function createContext({ req }: CreateContextOptions) {
	let _session: Session | undefined;
	return {
		getSession: async (): Promise<Session> => {
			if (_session === undefined) {
				_session = await auth.api.getSession({
					headers: req.headers,
				});
			}
			return _session;
		},
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
