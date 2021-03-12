const auth = require("../../middlewares/auth");
const { User } = require("../../models/users");

describe("auth middleware", () => {
  it("should populate req.user with the payload of a valid jwt", async () => {
    const user = new User({
      name: "hmed soupap",
      isAdmin: false,
    });
    const token = await user.generateJWT();
    req = {
      header: jest.fn().mockReturnValue(token),
    };
    res = {};
    next = jest.fn();
    auth(req, res, next);
    expect(req.user).toBeDefined();
    expect(req.user).toMatchObject({
      name: "hmed soupap",
      isAdmin: false,
    });
    expect(next).toHaveBeenCalled();
  });
});
