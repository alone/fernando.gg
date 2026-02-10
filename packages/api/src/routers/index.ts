import { router } from "../index";
import { blogRouter } from "./blog";
import { projectRouter } from "./project";
import { uploadRouter } from "./upload";

export const appRouter = router({
	blog: blogRouter,
	project: projectRouter,
	upload: uploadRouter,
});
export type AppRouter = typeof appRouter;
