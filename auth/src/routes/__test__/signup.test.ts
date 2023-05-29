import request from "supertest";
import { app } from "../../app";
import { signup } from "../../test/auth-helper";

it("returns a 201 on successful signup", async () => {
  await signup();
});

it("returns a 400 with an invalid email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "exampledomain.com",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "example@domain.com",
      password: "p",
    })
    .expect(400);
});

it("returns a 400 with missing email and password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "example@domain.com" })
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send({ password: "password" })
    .expect(400);
});

it("disallows duplicate emails", async () => {
  await signup();
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "example@domain.com",
      password: "password",
    })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const cookie = await signup();
  expect(cookie).toBeDefined();
});
