import { booksResolver } from "../../src/fields/books/books";
import { stubContext } from "../stubContext";

const TEST_BOOK_ONE = {
  id: 123456789,
  title: "test-title",
  description: "test-description",
  authors: ["test-author"],
};

describe("Books resolver", () => {
  beforeEach(() => {
    stubContext.dataSources.catalogue.clear();
  });

  it("returns empty when no data", async () => {
    const result = await booksResolver(
      {},
      { first: 1, ids: ["123456789"] },
      stubContext,
      {} as any,
    );

    expect(result.edges).toHaveLength(0);
  })

  it("it returns a books object", async () => {
    stubContext.dataSources.catalogue.stubCatalogueDocument(
      { id: "123456789", field: "book" },
      JSON.stringify(TEST_BOOK_ONE),
    );

    const result = await booksResolver(
      {},
      { first: 1, ids: ["123456789"] },
      stubContext,
      {} as any,
    );

    expect(result.edges).toHaveLength(1);
    expect(result.edges[0].node).toEqual(TEST_BOOK_ONE);
  });
});
