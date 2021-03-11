const {
  absolute,
  greet,
  getCurrencies,
  getProduct,
  registerUser,
  applyDiscount,
  notifyCustomer,
} = require("./lib");
const { fizzBuzz } = require("./exercise1");
const db = require("./db");
const mail = require("./mail");

describe("absolute", () => {
  it("should return a positive number if input is positive", () => {
    const result = absolute(1);
    expect(result).toBe(1);
  });

  it("should return a positive number if input is negative", () => {
    const result = absolute(-1);
    expect(result).toBe(1);
  });

  it("should return 0 if input is 0", () => {
    const result = absolute(0);
    expect(result).toBe(0);
  });
});

describe("greet", () => {
  it("should return the greeting message", () => {
    const result = greet("Chaabane");
    expect(result).toBe("Welcome Chaabane!");
    expect(result).toMatch(/.*Chaabane.*/);
    expect(result).toContain("Chaabane");
  });
});

describe("getCurrencies", () => {
  it("should return supported currencies", () => {
    const result = getCurrencies();
    // Too general
    expect(result).toBeDefined();
    expect(result).not.toBeNull();
    // Too specific
    expect(result[0]).toBe("USD");
    expect(result[1]).toBe("AUD");
    expect(result[2]).toBe("EUR");
    expect(result.length).toBe(3);
    // Proper way
    expect(result).toContain("AUD");
    expect(result).toContain("EUR");
    expect(result).toContain("USD");
    //Ideal way
    expect(result).toEqual(expect.arrayContaining(["USD", "EUR", "AUD"]));
  });
});

describe("getProduct", () => {
  it("should return the greeting message", () => {
    const result = getProduct(99);
    //specific
    expect(result).toEqual({ id: 99, price: 10 });
    //ideal
    expect(result).toMatchObject({ id: 99, price: 10 }); // test only attr we interested in
    expect(result).toHaveProperty("id", 99); // type matter, "99" makes test fail
  });
});

describe("registerUser", () => {
  it("should throw exception if user name is falsy", () => {
    expect(() => {
      registerUser();
    }).toThrow(new Error("Username is required."));
    expect(() => {
      registerUser();
    }).toThrow(Error);
    expect(() => {
      registerUser();
    }).toThrow();
  });
  it("should return an user object if valid username was passed", () => {
    const result = registerUser("bingo");
    expect(result).toMatchObject({ username: "bingo" });
    expect(result).toMatchObject({ id: expect.any(Number) });
  });
});

describe("exercice1", () => {
  it("should throw an error if input type is other than number", () => {
    expect(() => {
      fizzBuzz();
    }).toThrow();
    expect(() => {
      fizzBuzz(null);
    }).toThrow();
    expect(() => {
      fizzBuzz("a");
    }).toThrow();
  });
  it("should return FizzBuzz if input divisible by 3 and 5", () => {
    const result = fizzBuzz(15);
    expect(result).toBe("FizzBuzz");
  });
  it("should return Fizz if input divisible by 3 only", () => {
    const result = fizzBuzz(6);
    expect(result).toBe("Fizz");
  });
  it("should return Buzz if input divisible by 5 only", () => {
    const result = fizzBuzz(10);
    expect(result).toBe("Buzz");
  });
  it("should return the passed input if it not divisible 3 nor 5", () => {
    const result = fizzBuzz(11);
    expect(result).toBe(11);
  });
});

describe("applyDiscount", () => {
  it("should apply 10% discount if customer has more than 10 point", () => {
    db.getCustomerSync = (id) => {
      // console.log("Faking reading customer...");
      return { id: id, points: 20 };
    };
    const order = { id: 99, totalPrice: 10 };
    applyDiscount(order);
    expect(order.totalPrice).toBe(9);
  });
  it("my freaking implementation to the on the top", () => {
    db.getCustomerSync = jest.fn().mockImplementation((id) => {
      //console.log("Faking reading customer...");
      return { id: id, points: 20 };
    });
    const order = { id: 99, totalPrice: 10 };
    applyDiscount(order);
    expect(order.totalPrice).toBe(9);
  });
  it("should not apply 10% discount if customer has less or equal to 10 point", () => {
    db.getCustomerSync = jest.fn().mockImplementation((id) => {
      return { id: id, points: 9 };
    });
    const order = { id: 99, totalPrice: 10 };
    applyDiscount(order);
    expect(order.totalPrice).toBe(10);
  });
});

describe("notifyCustomer", () => {
  it("should send an email to the customer", () => {
    db.getCustomerSync = jest.fn().mockImplementation((id) => {
      //console.log("Faking mailing customer...");
      return { email: "aha@aha" };
    });
    mail.send = jest.fn();

    const order = { id: 99, totalPrice: 10 };
    notifyCustomer(order);

    expect(mail.send).toHaveBeenCalled();
    expect(mail.send).toHaveBeenCalledWith(
      "aha@aha",
      "Your order was placed successfully."
    );
    expect(mail.send.mock.calls[0][0]).toMatch(/aha@aha/);
    expect(mail.send.mock.calls[0][1]).toMatch(
      /Your order was placed successfully./
    );
  });
});
