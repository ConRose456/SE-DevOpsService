import { booksResolver } from "../../src/fields/books/books";
import { stubContext } from "../stubContext";

const TEST_BOOK_ONE = {
  id: 123456789,
  title: "test-title",
  description: "test-description",
  authors: ["test-author"],
};

const TEST_BOOK_TWO = {
  id: 234567891,
  title: "test-title-2",
  description: "test-description-2",
  authors: ["test-author-2"],
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
  });

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

  it("it returns a books object when filtered", async () => {
    stubContext.dataSources.catalogue.stubCatalogueDocument(
      { id: "123456789", field: "book" },
      JSON.stringify(TEST_BOOK_ONE),
    );

    stubContext.dataSources.catalogue.stubCatalogueDocument(
      { id: "1234567891", field: "book" },
      JSON.stringify(TEST_BOOK_TWO),
    );

    const result = await booksResolver(
      {},
      {
        first: 1,
        ids: ["123456789", "1234567891"],
        filter: { titleText: "test-title-2" },
      },
      stubContext,
      {} as any,
    );

    expect(result.edges).toHaveLength(1);
    expect(result.edges[0].node).toEqual(TEST_BOOK_TWO);
  });
});
