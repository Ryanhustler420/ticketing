import request from "supertest";
import { app } from "../../app";
import { signup } from "../../test/auth-helper";

it("clears the cookie after signing out", async () => {
  await signup();
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "example@domain.com",
      password: "password",
    })
    .expect(200);

  const response = await request(app)
    .post("/api/users/signout")
    .send({})
    .expect(200);

  expect(response.get("Set-Cookie")[0]).toEqual(
    "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});
