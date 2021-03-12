const { User } = require("../../models/users");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

describe("Users.generateJWTl", () => {
  it("should generate jwt correctly", async () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      name: "name",
      isAdmin: true,
    };
    const user = new User(payload);
    const token = await user.generateJWT();
    const decodedPayload = jwt.verify(token, config.get("jwtSecretKey"));
    expect(decodedPayload).toMatchObject(payload);
  });
});
