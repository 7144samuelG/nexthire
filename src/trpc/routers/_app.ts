import { createTRPCRouter } from '../init';
import { jobsRouter } from '@/features/jobs/server/routers';
export const appRouter = createTRPCRouter({
  jobs:jobsRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
