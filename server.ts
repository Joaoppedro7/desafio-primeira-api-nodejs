import fastify from "fastify";
import { fastifySwagger } from "@fastify/swagger";
import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import { createCourseRoute } from "./src/routes/create-course.ts";
import { getCourseByIdRoute } from "./src/routes/get-course-by-id.ts";
import { getCoursesRoute } from "./src/routes/get-courses.ts";
import scalarAPIReference from "@scalar/fastify-api-reference";

const server = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>();

if (process.env.NODE_ENV === "development") {
  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Desafio Node.js",
        version: "1.0.0",
      },
    },
    transform: jsonSchemaTransform,
  });

  server.register(scalarAPIReference, {
    routePrefix: "/docs",
    configuration: {
      theme: "kepler",
    },
  });
}
server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);

server.register(createCourseRoute);
server.register(getCourseByIdRoute);
server.register(getCoursesRoute);

// server.put("/courses/:id", (request, reply) => {
//   type Body = {
//     title: string;
//   };
//   type Params = {
//     id: string;
//   };

//   const body = request.body as Body;
//   const courseTitle = body.title;

//   const params = request.params as Params;
//   const courseId = params.id;

//   const course = courses.find((course) => course.id === courseId);

//   if (!course) {
//     return reply.status(404).send({ message: "Registro não encontrado" });
//   }

//   if (courseTitle) {
//     course.title = courseTitle;
//   }

//   return { course };
// });

// server.delete("/courses/:id", (request, reply) => {
//   type Params = {
//     id: string;
//   };

//   const params = request.params as Params;
//   const courseId = params.id;

//   const course = courses.find((course) => course.id === courseId);
//   const courseIndex = courses.findIndex((course) => course.id === courseId);

//   if (!course) {
//     return reply.status(404).send({ message: "Registro não encontrado" });
//   }

//   courses.splice(courseIndex, 1);

//   return reply.status(200).send({ message: "Item removido com sucesso." });
// });

server.listen({ port: 3333 }).then(() => {
  console.log("HTTP Server running!");
});
