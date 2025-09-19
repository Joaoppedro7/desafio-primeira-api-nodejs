import { test, expect } from "vitest";
import { server } from "../app.ts";
import request from "supertest";
import { faker } from "@faker-js/faker";
import { randomUUID } from "node:crypto";
import { hash } from "argon2";

test("Sign Up", async () => {
  await server.ready();

  const passwordBeforeHash = randomUUID();

  const userData = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: await hash(passwordBeforeHash),
  };

  const response = await request(server.server)
    .post("/register")
    .set("Content-Type", "application/json")
    .send(userData);

  expect(response.status).toEqual(201);
  expect(response.body).toEqual({
    id: expect.any(String),
  });
});
