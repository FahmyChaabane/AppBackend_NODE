const request = require("supertest");
const { Genre } = require("../../models/genres");
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
    it("should specific genre of passed id", async () => {
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
});
