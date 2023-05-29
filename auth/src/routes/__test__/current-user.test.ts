import request from "supertest";
import { app } from "../../app";
import { signup } from "../../test/auth-helper";

it("responsed with details about the current user", async () => {
  const cookie = await signup();
  console.log(cookie)

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual("example@domain.com");
});

it("responsed with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
