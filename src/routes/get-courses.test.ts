import { test, expect } from "vitest";
import { randomUUID } from "node:crypto";
import { server } from "../app.ts";
import request from "supertest";
import { makeCourse } from "../tests/factories/make-course.ts";
import { makeAuthenticatedUser } from "../tests/factories/make-user.ts";

test("Get courses", async () => {
  await server.ready();

  const { token } = await makeAuthenticatedUser("manager");

  const titleID = randomUUID();
  const course = await makeCourse(titleID);

  const response = await request(server.server)
    .get(`/courses?search=${titleID}`)
    .set("Authorization", token);

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
