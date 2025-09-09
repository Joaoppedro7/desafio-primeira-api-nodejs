import { test, expect } from "vitest";
import { server } from "../app.ts";
import request from "supertest";
import { faker } from "@faker-js/faker";
import { makeCourse } from "../tests/factories/make-course.ts";

test("Get course by id.", async () => {
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
