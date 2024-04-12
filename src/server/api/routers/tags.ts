import { type Prisma } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const tagsToImport = `L4/TECHNICAL-EXECUTION/DESIGN/LARGE-PATTERNS,Uses appropriate design patterns and algorithms for software designs of large scope.
L4/TECHNICAL-EXECUTION/DESIGN/LARGE-TECH-SYSTEMS,Uses appropriate technologies and system designs for architectural decisions of large scope and scale.
L4/TECHNICAL-EXECUTION/DESIGN/IDENTIFY-SCALE,Identifies and resolves ongoing performance and scalability bottlenecks.
L4/TECHNICAL-EXECUTION/DESIGN/CODE-COMP,Improves their team's code comprehension and reusability.
L4/TECHNICAL-EXECUTION/IMPLEMENTATION/CODE-STANDARDS,Drives alignment on code quality standards for their team. Enforces these standards by providing consistent feedback on pull requests.
L4/TECHNICAL-EXECUTION/OPERATIONS/IMPROVES-OBSERVABILITY,Improves the overall observability and operability of their team's services and code.
L4/TECHNICAL-EXECUTION/OPERATIONS/CUSTOMER-SUPPORT,"As needed, works directly with customers and our support team to diagnose and resolve production issues."
L4/TECHNICAL-EXECUTION/OPERATIONS/PROACTIVE-IMPROVEMENT,"Proactively improves their team's service health in other ways, such as by refactoring inefficient code or identifying and completing forward-thinking post-incident remediations."
L4/COLLABORATIVE-IMPACT/EFFICACY/ROLE-MODEL,Acts as a role model for how teammates can increase their effectiveness.
L4/COLLABORATIVE-IMPACT/DECISION-MAKING/LARGE-RESOLUTION,"Resolves decisions of large scope based on learnings from tools such as data analysis, cost analysis, and internal dogfooding."
L4/COLLABORATIVE-IMPACT/DECISION-MAKING/ALIGNMENT,Identifies areas of misalignment within their team and brings stakeholders together to realign.
L4/COLLABORATIVE-IMPACT/PLANNING/LARGE-DECOMPOSITION,Leads the decomposition of projects of large complexity to facilitate incremental delivery.
L4/COLLABORATIVE-IMPACT/PLANNING/LARGE-LEAD,Leads one or more projects of large scope every twelve months.
L4/COLLABORATIVE-IMPACT/PLANNING/TEAMMATE-UNCERTAINTY,Helps teammates eliminate their areas of uncertainty.
L4/COLLABORATIVE-IMPACT/PLANNING/PROJECT-ESTIMATES,"Collaborates with product, design, and other engineers to consistently provide reliable “t-shirt size” project estimates."
L4/LEADERSHIP/CUSTOMER-FOCUS/CUSTOMER-EXPERIENCE,Drives their team to deliver experiential impact aligned with our Product Principles.
L4/LEADERSHIP/INITIATIVE/PROCESS-COHESION,Identifies and executes on opportunities to improve team attributes such as process and cohesion.
L4/LEADERSHIP/PROVIDING-DIRECTION/LARGE-ONE-PAGERS,Authors one-pagers and technical specifications of large complexity and scope.
L4/LEADERSHIP/PROVIDING-DIRECTION/EXTRA-UNDERSTANDING,Has a deep understanding of at least one component of their organization's domain beyond their team's ownership areas.
L3/TECHNICAL-EXECUTION/DESIGN/PATTERNS,Using appropriate design patterns and algorithms for software designs.
L3/TECHNICAL-EXECUTION/DESIGN/TECH-SYSTEMS ,Utilizing suitable technologies and system designs for architectural decisions.
L3/TECHNICAL-EXECUTION/DESIGN/DATA-MODELS,Constructing data models with appropriate structures.
L2/TECHNICAL-EXECUTION/DESIGN/PERFORMANCE,Contributions adhere to our performance guidelines when running with production traffic levels.
L2/TECHNICAL-EXECUTION/DESIGN/SECURITY ,Contributions follow security best practices.
L3/TECHNICAL-EXECUTION/IMPLEMENTATION/GOOD-CODE,Consistently writing maintainable and well-tested code.
L3/TECHNICAL-EXECUTION/IMPLEMENTATION/GOOD-PRS,"Submitting pull requests with appropriate test coverage and quality, without requiring extensive refactoring."
L3/TECHNICAL-EXECUTION/IMPLEMENTATION/DECOMPOSES-CHANGES,Actively seeking feedback on significant code changes and breaking them into manageable pull requests.
L3/TECHNICAL-EXECUTION/IMPLEMENTATION/WIDE-CONTRIBUTION,Efficiently contributing to various components of the codebase.
L3/TECHNICAL-EXECUTION/OPERATIONS/HIGH-OBSERVABILITY,Delivering code with high observability and effectively resolving production issues.
L3/TECHNICAL-EXECUTION/OPERATIONS/EFFICIENTLY-DEBUGS,Efficiently debugging and troubleshooting production issues.
L2/TECHNICAL-EXECUTION/OPERATIONS/OPERATIONAL-RESPONSIBILITIES,Participates in their team’s operational responsibilities such as daytime on-call.
L3/COLLABORATIVE-IMPACT/EFFICACY/TEAM-PRIO,Prioritizing the team's overall velocity and proactively unblocking teammates.
L2/COLLABORATIVE-IMPACT/EFFICACY/LEARNS-FROM-MISTAKES,Learns from their missteps so that the missteps don’t reoccur.
L3/COLLABORATIVE-IMPACT/DECISION-MAKING/RESOLUTION,Resolving decisions of moderate scope through analysis and driving alignment.
L3/COLLABORATIVE-IMPACT/DECISION-MAKING/ALIGNMENT,Making decisions and resolving disagreements to align with the team's goals.
L3/COLLABORATIVE-IMPACT/PLANNING/INCREMENTAL-DELIVERY,Independently breaking down projects of moderate complexity to achieve incremental delivery.
L3/COLLABORATIVE-IMPACT/PLANNING/FEATURE-LEAD,Taking the lead on one or more projects of moderate or greater scope every six months.
L3/COLLABORATIVE-IMPACT/PLANNING/COM-CONFIDENCE,Effectively communicating confidence levels and addressing areas of uncertainty in project planning.
L3/COLLABORATIVE-IMPACT/PLANNING/ELIM-UNCERTAINTY,Eliminating uncertainty early in projects to increase confidence and resolve areas of uncertainty.
L3/COLLABORATIVE-IMPACT/TEAM-STRENGTHENING/PAIR,Collaborating with teammates through knowledge sharing and joint problem-solving / pairing.
L3/COLLABORATIVE-IMPACT/TEAM-STRENGTHENING/PR-ENABLEMENT,"Empowering teammates to provide feedback efficiently, especially in pull request reviews."
L2/COLLABORATIVE-IMPACT/TEAM-STRENGTHENING/CRITICAL-REVIEW,Critically reviews specifications and pull requests authored by teammates.
L3/COLLABORATIVE-IMPACT/TEAM-STRENGTHENING/DISSEMINATION,Effectively disseminating knowledge verbally and in written form.
L3/COLLABORATIVE-IMPACT/TEAM-STRENGTHENING/AD-HOC-ASSIST,Providing ad hoc assistance to engineers on neighboring teams and responding to escalations as expected by management.
L3/COLLABORATIVE-IMPACT/TEAM-STRENGTHENING/MENTOR,Mentoring less experienced teammates and actively maintaining or improving team cohesion.
L3/COLLABORATIVE-IMPACT/TEAM-STRENGTHENING/COHESION,Providing team cohesion and nurturing teamwork.
L3/LEADERSHIP/CUSTOMER-FOCUS/ADVOCATE,Consistently advocating for customers and their needs.
L2/LEADERSHIP/CUSTOMER-FOCUS/IMPACT,Individually delivers experiential impact aligned with our Product Principles.
L3/LEADERSHIP/TAKING-INITIATIVE/PROD-IMPRV,Proactively and incrementally improving the team's product and code beyond assigned tasks. Consistently leaves their team's product and code in a better state
L2/LEADERSHIP/TAKING-INITIATIVE/INITIATIVE,"Demonstrates initiative in other ways, such as participating in a guild, facilitating team meetings (retrospectives, service health, and so forth), or running"
L3/LEADERSHIP/PROVIDING-DIRECTION/ONE-PAGERS,Authoring one-pagers and technical specifications for projects of moderate complexity and scope.
L3/LEADERSHIP/PROVIDING-DIRECTION/UNDERSTAND-COMPONENTS,Demonstrating a deep understanding of multiple components within the team's domain.
L2/LEADERSHIP/PROVIDING-DIRECTION/PROPOSALS,Proposes impactful initiatives to advance their team's mission.`;

export const tagRouter = createTRPCRouter({
  // importTags: protectedProcedure.mutation(async ({ ctx }) => {
  //   const tags = tagsToImport.split("\n").map((tag) => {
  //     const [name, description] = tag.split(",");
  //     if (!name || !description) return null; // Filter out invalid entries
  //     return {
  //       name,
  //       description,
  //       createdById: ctx.session.user.id,
  //     };
  //   }) as Prisma.TagCreateManyArgs["data"];

  //   return ctx.db.tag.createMany({
  //     data: tags,
  //     skipDuplicates: true,
  //   });
  // }),

  // Get all tags
  getAllTags: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.tag.findMany();
  }),

  // Create a new tag
  createTag: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.tag.create({
        data: {
          name: input.name,
          description: input.description,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  // Update an existing tag
  updateTag: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.tag.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      });
    }),

  deleteTag: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.tag.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
