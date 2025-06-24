import { validityResolver } from "../../../src/fields/auth/validity";
import { stubContext } from "../../stubContext";

describe("Validity Resolver", () => {
  beforeEach(() => {
    process.env.LOCAL_SECRET = "mock-secret";
  });

  afterAll(() => {
    delete process.env.LOCAL_SECRET;
  });

  it("returns valid respose when valid token", async () => {
    const result = await validityResolver({}, {}, stubContext, {} as any);

    expect(result).toEqual({
      isValid: true,
      expireDate: "",
      isAdmin: false,
    });
  });

  it("returns invalid respose when no valid token", async () => {
    const result = await validityResolver(
      {},
      {},
      {
        ...stubContext,
        isAuthed: () => ({}),
      },
      {} as any,
    );

    expect(result).toEqual({
      isValid: false,
      expireDate: "",
      isAdmin: false,
    });
  });
});
