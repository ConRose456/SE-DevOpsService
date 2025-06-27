import { homeResolver } from "../../src/fields/home";
import { stubContext } from "../stubContext";

describe("Home resolver", () => {
  it("it returns the catalogue of books", async () => {
    stubContext.dataSources.catalogue.stubCatalogueDocument(
      { id: "", field: "bookCatalogue" },
      JSON.stringify({
        books: ["9780545069670", "9780545069671", "9780545069672"],
      }),
    );

    const result = await homeResolver({}, {}, stubContext, {});

    expect(result).toEqual(["9780545069670", "9780545069671", "9780545069672"]);
  });
});
