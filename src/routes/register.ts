import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/client.ts";
import { users } from "../database/schema.ts";
import z from "zod";
import { eq } from "drizzle-orm";
import { hash } from "argon2";

export const registerRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/register",
    {
      schema: {
        tags: ["auth"],
        summary: "Sign Up",
        body: z.object({
          name: z.string(),
          email: z.email(),
          password: z.string(),
        }),
        response: {
          201: z.object({
            id: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body;

      const result = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (result.length > 0) {
        return reply.status(400).send({ message: "email already exists" });
      }

      const registeredUser = await db
        .insert(users)
        .values({
          name,
          email,
          password: await hash(password),
        })
        .returning();

      const user = registeredUser[0];

      return reply.status(201).send({ id: user.id });
    }
  );
};
