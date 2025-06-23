import { signOutResolver } from "../../../src/fields/auth/signOut";
import { stubContext } from "../../stubContext";

describe("Sign out resolver", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "mock-secret";
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
  });

  it("Removes the sign in token and returns success true", async () => {
    const result = await signOutResolver(
      {},
      {},
      {
        ...stubContext,
        res: {
          cookie: (..._args) => {},
        },
      },
      {} as any,
    );
    expect(result).toEqual({ success: true });
  });

  it("returns success false when no valid token", async () => {
    const result = await signOutResolver({}, {}, stubContext, {} as any);
    expect(result).toEqual({ success: false });
  });
});
