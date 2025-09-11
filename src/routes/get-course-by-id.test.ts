import { test, expect } from "vitest";
import { server } from "../app.ts";
import request from "supertest";
import { faker } from "@faker-js/faker";
import { makeCourse } from "../tests/factories/make-course.ts";

test("get course by id.", async () => {
  await server.ready();

  const course = await makeCourse();

  const response = await request(server.server).get(`/courses/${course.id}`);

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({
    course: {
      id: expect.any(String),
      title: expect.any(String),
      description: null,
    },
  });
});

test("return 404 for non existing courses.", async () => {
  await server.ready();

  const response = await request(server.server)
    .get(`/courses/9F8A3C71-2C2B-4C4E-9E9D-3F6D61D0F43E
`);

  expect(response.status).toEqual(404);
});
