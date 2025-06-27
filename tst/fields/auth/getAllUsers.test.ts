import { getAllUsersResolver } from "../../../src/fields/auth/getAllUsers";
import { stubContext } from "../../stubContext";

const adminContext = {
  ...stubContext,
  isAuthed: () => ({ decoded: { userId: "test-admin", isAdmin: true } }),
};

const TEST_USER_ONE = {
  username: "user-1",
  password: "test=password-1",
  isAdmin: false,
};

const TEST_USER_TWO = {
  username: "user-2",
  password: "test=password-2",
  isAdmin: false,
};

describe("getAllUsers Resolver", () => {
  beforeEach(() => {
    stubContext.dataSources.auth.clear();
  });

  it("throws unauthorised error if user is not authorised", async () => {
    await expect(getAllUsersResolver({}, {}, stubContext, {})).rejects.toThrow(
      "[UNAUTHORISED] - User not authorised",
    );
  });

  it("it returns empty array when no users", async () => {
    const result = await getAllUsersResolver({}, {}, adminContext, {});

    expect(result).toEqual([]);
  });

  it("it returns all users", async () => {
    stubContext.dataSources.auth.stubUserDocument(
      { username: TEST_USER_ONE.username },
      JSON.stringify(TEST_USER_ONE),
    );

    stubContext.dataSources.auth.stubUserDocument(
      { username: TEST_USER_TWO.username },
      JSON.stringify(TEST_USER_TWO),
    );

    const result = await getAllUsersResolver({}, {}, adminContext, {});

    expect(result).toEqual([
      { ...TEST_USER_ONE, password: undefined },
      { ...TEST_USER_TWO, password: undefined },
    ]);
  });
});
