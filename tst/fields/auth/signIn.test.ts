import { signInResolver } from "../../../src/fields/auth/signIn";
import { stubContext } from "../../stubContext";

describe("Sign In Resolver", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "mock-secret";
    stubContext.dataSources.auth.clear();
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
  });

  it("Throws Invalid credentials when login details are incorrect", async () => {
    stubContext.dataSources.auth.stubUserDocument(
      { username: "fake-user" },
      JSON.stringify({
        username: "fake-user",
        password: "fake-password",
        email: "fake-email",
        name: "fake-name",
        surname: "fake-surname",
        isAdmin: false,
      }),
    );

    await expect(
      signInResolver(
        {},
        {
          username: "invalid-user",
          password: "invalid-password",
        },
        stubContext,
        {} as any,
      ),
    ).rejects.toThrow();
  });

  it("Creates token if valid user", async () => {
    console.log(process.env.JWT_SECRET);
    stubContext.dataSources.auth.stubUserDocument(
      { username: "fake-user" },
      JSON.stringify({
        username: "fake-user",
        password:
          "$2b$12$nFx6oKiPLtlNdyLAsaZhmOJhNnJxtbYt.B0GwrIsmKwKrTs2w00Q6",
        email: "fake-email",
        name: "fake-name",
        surname: "fake-surname",
        isAdmin: false,
      }),
    );

    const result = await signInResolver(
      {},
      {
        username: "fake-user",
        password: "fake-password",
      },
      stubContext,
      {} as any,
    );

    expect(result.token).toBeDefined();
  });
});
