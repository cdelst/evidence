import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const evidenceRouter = createTRPCRouter({
  // Get all evidence
  getAllEvidence: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.evidence.findMany();
  }),

  // Create a new evidence
  createEvidence: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        source: z.string().min(1),
        type: z.string().cuid(),
        impact: z.number().min(1).max(5),
        tags: z.array(z.string().cuid()),
        context: z.string().min(1),
        date: z.date().max(new Date()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.evidence.create({
        data: {
          title: input.title,
          description: input.description,
          source: input.source,
          type: { connect: { id: input.type } },
          impact: input.impact,
          tags: { connect: input.tags.map((tag) => ({ id: tag })) },
          context: input.context,
          date: input.date,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  // Update an existing evidence
  updateEvidence: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        title: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        source: z.string().min(1).optional(),
        type: z.string().cuid().optional(),
        impact: z.number().min(1).max(5).optional(),
        tags: z.array(z.string().cuid()).optional(),
        context: z.string().min(1).optional(),
        date: z.date().max(new Date()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updateData = {
        title: input.title,
        description: input.description,
        source: input.source,
        type: input.type ? { connect: { id: input.type } } : undefined,
        impact: input.impact,
        tags: input.tags
          ? { connect: input.tags.map((tag) => ({ id: tag })) }
          : undefined,
        context: input.context,
        date: input.date,
      };
      return ctx.db.evidence.update({
        where: { id: input.id },
        data: updateData,
      });
    }),
});
