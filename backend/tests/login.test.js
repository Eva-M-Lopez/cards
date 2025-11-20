import request from "supertest";
import app from "../server.js";

describe("POST /api/login", () => {
  it("should return error for invalid login", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ login: "wrong", password: "wrong" });

    expect(res.body.error).toBe("Invalid user name/password");
  });
});
