import { hashPassword, signUpResolver } from "../../../src/fields/auth/signUp";
import { stubContext } from "../../stubContext";

describe("SignUp Resolver", () => {
  beforeAll(() => {
    process.env.LOCAL_SECRET = "test-secret";
  });

  afterAll(() => {
    delete process.env.LOCAL_SECRET;
  });

  it("Creates a new user and returns a token", async () => {
    const result = await signUpResolver(
      {},
      {
        password: "password",
        username: "test-user",
      },
      stubContext,
      {},
    );

    expect(result.alreadyExists).toEqual(false);
    expect(result.token).toBeDefined();
  });

  it("return alreadyExists is a user already has the same username", async () => {
    // should not return a token, should be empty string
    stubContext.dataSources.auth.stubCreateUser("test-username", {
      alreadyExists: true,
      token: "testToken",
    });

    const result = await signUpResolver(
      {},
      {
        password: "test-password",
        username: "test-username",
      },
      stubContext,
      {},
    );

    expect(result).toEqual({
      alreadyExists: true,
      token: "",
    });
  });

  it("passwords are hashed", async () => {
    const result = hashPassword("test-password");
    expect(result).not.toEqual("test-password");
  });
});
