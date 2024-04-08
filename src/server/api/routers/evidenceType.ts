import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const evidenceTypeRouter = createTRPCRouter({
  // Get all evidence types
  getAllEvidenceTypes: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.evidenceType.findMany();
  }),

  // Create a new evidence type
  createEvidenceType: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.evidenceType.create({
        data: {
          name: input.name,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  // Update an existing evidence type
  updateEvidenceType: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.evidenceType.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      });
    }),

  deleteEvidenceType: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.evidenceType.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
