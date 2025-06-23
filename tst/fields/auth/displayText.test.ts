import { displayText } from "../../../src/fields/auth/displayText";
import { stubContext } from "../../stubContext";

describe("DisplayText Resolver", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "mock-secret";
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
  });

  it("returns user text respose when valid token", async () => {
    const result = displayText({}, {}, stubContext, {} as any);

    expect(result).toEqual({
      text: "test-user",
    });
  });

  it("returns empty user text when not signed in", async () => {
    const result = displayText(
      {},
      {},
      {
        ...stubContext,
        isAuthed: () => ({}),
      },
      {} as any,
    );

    expect(result).toEqual({
      text: "",
    });
  });
});
