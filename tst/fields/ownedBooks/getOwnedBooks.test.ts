import { getOwnedBooks } from "../../../src/fields/ownedBooks/getOwnedBooks";
import { stubContext } from "../../stubContext";

const TEST_BOOK_ONE = "123456789";
const TEST_BOOK_TWO = "234567891";

describe("Books resolver", () => {
  beforeEach(() => {
    stubContext.dataSources.auth.clear();
    stubContext.dataSources.catalogue.clear();
  });

  it("returns empty when no data", async () => {
    const result = await getOwnedBooks([], {}, stubContext, {} as any);

    expect(result).toHaveLength(0);
  });

  it("it returns an array of book ids", async () => {
    stubContext.dataSources.catalogue.stubCatalogueDocument(
      { id: "test-user", field: "ownedBooks" },
      JSON.stringify({
        id: "test-user",
        ownedBookIds: [TEST_BOOK_ONE, TEST_BOOK_TWO],
      }),
    );

    const result = await getOwnedBooks([], {}, stubContext, {} as any);

    expect(result).toHaveLength(2);
    expect(result).toEqual([TEST_BOOK_ONE, TEST_BOOK_TWO]);
  });
});
