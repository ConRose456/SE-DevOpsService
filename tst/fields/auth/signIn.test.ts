import { signInResolver } from "../../../src/fields/auth/signIn";
import { stubContext } from "../../stubContext";

describe("Sign In Resolver", () => {
  beforeEach(() => {
    process.env.LOCAL_SECRET = "mock-secret";
    stubContext.dataSources.auth.clear();
  });

  afterAll(() => {
    delete process.env.LOCAL_SECRET;
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
    console.log(process.env.LOCAL_SECRET);
    stubContext.dataSources.auth.stubUserDocument(
      { username: "fake-user" },
      JSON.stringify({
        username: "fake-user",
        password:
          "3fa6ef88d9668591cf7bfcde26f3cbdffa2d50795baee8866ee3a5dc71dfd3b9:6120d95eef72b4c8a318fd0ac7334a1c84dc0444073b6202e6fe98a269550186eba00aff50434b0df5aa5c86e59c7d00a2814b0adf21bab374d48e46a8513e28",
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
