import { test, expect } from "vitest";
import { randomUUID } from "node:crypto";
import { server } from "../app.ts";
import request from "supertest";
import { makeCourse } from "../tests/factories/make-course.ts";

test("Get course by id.", async () => {
  await server.ready();

  const titleID = randomUUID();
  const course = await makeCourse(titleID);

  const response = await request(server.server).get(
    `/courses?search=${titleID}`
  );

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({
    total: 1,
    courses: [
      {
        id: expect.any(String),
        title: titleID,
        enrollments: 0,
      },
    ],
  });
});
