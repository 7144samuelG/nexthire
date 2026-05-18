import { createTRPCRouter } from '../init';
import { jobsRouter } from './jobs';
 
export const appRouter = createTRPCRouter({
  jobs:jobsRouter
});
 
// export type definition of API
export type AppRouter = typeof appRouter;