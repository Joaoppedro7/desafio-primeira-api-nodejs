import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/client.ts";
import { courses } from "../database/schema.ts";
import z from "zod";
import { checkRequestJWT } from "./hooks/check-request-jwt.ts";
import { checkUserRole } from "./hooks/check-user-role.ts";

export const createCourseRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/courses",
    {
      preHandler: [
        checkRequestJWT,
        async (request, reply) => {
          // Prefer a local check to customize the 401 message for this route
          const userRole = request.user?.role;
          if (userRole !== "manager") {
            return reply.status(401).send({
              message: "only users with manager role can create courses",
            });
          }
        },
      ],
      schema: {
        tags: ["Courses"],
        summary: "Create a course",
        body: z.object({
          title: z.string().min(5, "O título deve ter no mínimo 5 caracteres"),
        }),
        response: {
          201: z
            .object({
              courseId: z.uuid(),
            })
            .describe("Curso criado com sucesso"),
          401: z
            .object({
              message: z.literal(
                "only users with manager role can create courses"
              ),
            })
            .describe("Unauthorized: Only managers can create courses"),
        },
      },
    },
    async (request, reply) => {
      const courseTitle = request.body.title;

      const result = await db
        .insert(courses)
        .values({ title: courseTitle })
        .returning();

      return reply.status(201).send({ courseId: result[0].id });
    }
  );
};
