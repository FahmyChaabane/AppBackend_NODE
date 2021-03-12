const request = require("supertest");
const { Genre } = require("../../models/genres");
const { User } = require("../../models/users");
const mongoose = require("mongoose");

let server;
beforeEach(() => {
  server = require("../../index");
});
afterEach(async () => {
  await Genre.collection.deleteMany();
  server.close();
});

describe("api/genres", () => {
  describe("GET/ ", () => {
    it("should return all genres", async () => {
      Genre.collection.insertMany([{ name: "genre1" }, { name: "genre2" }]);
      const response = await request(server).get("/api/genres");
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body.some((item) => item.name === "genre1")).toBeTruthy();
      expect(response.body.some((item) => item.name === "genre2")).toBeTruthy();
    });
  });
  describe("GET/:id ", () => {
    it("should return specific genre of passed id", async () => {
      const genre = new Genre({
        name: "genre",
      });
      genre.save();
      const response = await request(server).get(`/api/genres/${genre._id}`);
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        name: genre.name,
      });
    });
    it("should return 404 status of invalid ID", async () => {
      const response = await request(server).get("/api/genres/1");
      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({});
      expect(response.text).toBe("Invalid ID.");
    });
    it("should return 404 status of invalid ID", async () => {
      const response = await request(server).get(
        `/api/genres/${new mongoose.Types.ObjectId().toHexString()}`
      );
      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({});
      expect(response.text).toBe("The genre with the given ID was not found.");
    });
  });
  describe("POST/ ", () => {
    it("should return 401 if client is not logged in", async () => {
      const response = await request(server).post("/api/genres").send({
        name: "genre",
      });
      expect(response.status).toBe(401);
      expect(response.text).toBe("Access denied. No token provided.");
    });
    it("should return 400 if token is invalid", async () => {
      const response = await request(server)
        .post("/api/genres")
        .set("x-auth-token", "xxx")
        .send({
          name: "genre",
        });
      expect(response.status).toBe(400);
      expect(response.text).toBe("Invalid token.");
    });
    it("should return 400 if http request body is invalid", async () => {
      const token = await new User().generateJWT();
      const response = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({
          name: "1234",
        });
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/.*name.*/);
    });
    it("should save genre object into the db", async () => {
      const token = await new User().generateJWT();
      await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({
          name: "genre",
        });
      const genre = await Genre.findOne({ name: "genre" });
      expect(genre).not.toBeNull();
    });
    it("should return genre object", async () => {
      /* pas la peine
      const user = new User({
        name: "hmed soupap",
        email: "jhonAbruzzi@pb.fr",
        password: "password",
      });
      await user.save();
      
      const token = await user.generateJWT();
      */
      const token = await new User().generateJWT();
      const response = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({
          name: "genre",
        });
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        _id: expect.any(String),
        name: "genre",
      });
    });
  });
  describe("DELETE/:id", () => {
    it("should return 401 if client not logged in", async () => {
      const response = await request(server).delete("/api/genres/9999");
      expect(response.status).toBe(401);
      expect(response.text).toContain("Access denied. No token provided.");
    });
    it("should return 400 if invalid token", async () => {
      const response = await request(server)
        .delete("/api/genres/9999")
        .set("x-auth-token", "xxxx");
      expect(response.status).toBe(400);
      expect(response.text).toContain("Invalid token.");
    });
    it("should return 403 if user is not admin", async () => {
      const token = await new User().generateJWT(); // { isAdmin: false }
      const response = await request(server)
        .delete("/api/genres/9999")
        .set("x-auth-token", token);
      expect(response.status).toBe(403);
      expect(response.text).toContain("Access denied.");
    });
    it("should return 404 if request param is invalid id", async () => {
      const token = await new User({ isAdmin: true }).generateJWT();
      const response = await request(server)
        .delete("/api/genres/9999")
        .set("x-auth-token", token);
      expect(response.status).toBe(404);
      expect(response.text).toContain("Invalid ID.");
    });
    it("should return 404 if genre does not exist", async () => {
      const token = await new User({ isAdmin: true }).generateJWT();
      const response = await request(server)
        .delete(`/api/genres/${new mongoose.Types.ObjectId().toHexString()}`)
        .set("x-auth-token", token);
      expect(response.status).toBe(404);
      expect(response.text).toContain(
        "The genre with the given ID was not found."
      );
    });
    it("should return a valid genre", async () => {
      const genre = new Genre({
        name: "genre",
      });
      genre.save();
      const token = await new User({ isAdmin: true }).generateJWT();
      const response = await request(server)
        .delete(`/api/genres/${genre._id}`)
        .set("x-auth-token", token);
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        name: "genre",
      });
    });
  });
  describe("PUT/:id", () => {
    it("should return 401 if client not logged in", async () => {
      const response = await request(server)
        .put("/api/genres/9999")
        .send({ name: "genre" });
      expect(response.status).toBe(401);
      expect(response.text).toContain("Access denied. No token provided.");
    });
    it("should return 400 if invalid token", async () => {
      const response = await request(server)
        .put("/api/genres/9999")
        .set("x-auth-token", "xxxx");

      expect(response.status).toBe(400);
      expect(response.text).toContain("Invalid token.");
    });
    it("should return 404 if request param is invalid id", async () => {
      const token = await new User().generateJWT();
      const response = await request(server)
        .put("/api/genres/9999")
        .set("x-auth-token", token)
        .send({ name: "genre" });

      expect(response.status).toBe(404);
      expect(response.text).toContain("Invalid ID.");
    });
    it("should return 400 if genre format object is not respected", async () => {
      const token = await new User().generateJWT();
      const response = await request(server)
        .put(`/api/genres/${new mongoose.Types.ObjectId().toHexString()}`)
        .set("x-auth-token", token)
        .send({ name: "1234" });

      expect(response.status).toBe(400);
      expect(response.text).toMatch(/name/);
    });
    it("should return 404 if genre does not exist", async () => {
      const token = await new User().generateJWT();
      const response = await request(server)
        .put(`/api/genres/${new mongoose.Types.ObjectId().toHexString()}`)
        .set("x-auth-token", token)
        .send({ name: "genre" });

      expect(response.status).toBe(404);
      expect(response.text).toContain(
        "The genre with the given ID was not found."
      );
    });
  });
  it("should return the modified valid genre", async () => {
    const genre = new Genre({
      name: "genre",
    });
    genre.save();
    const token = await new User().generateJWT();
    const response = await request(server)
      .put(`/api/genres/${genre._id}`)
      .set("x-auth-token", token)
      .send({ name: "modified" });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      name: "modified",
    });
  });
});
