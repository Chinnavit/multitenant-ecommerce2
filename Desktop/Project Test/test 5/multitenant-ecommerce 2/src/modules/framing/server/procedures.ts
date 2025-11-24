import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const framingRouter = createTRPCRouter({
  getOptions: baseProcedure.query(async ({ ctx }) => {
    const frames = await ctx.db.find({ collection: "frames", limit: 100, pagination: false });
    const mats = await ctx.db.find({ collection: "mats", limit: 100, pagination: false });
    return { frames: frames.docs, mats: mats.docs };
  }),
});