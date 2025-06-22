import { StubCatalogueDataSource } from "../src/dataSources/catalogueDataSource";

const stubCatalogueDataSource = new StubCatalogueDataSource();

export const stubContext = {
  dataSources: {
    catalogue: stubCatalogueDataSource,
  },
};
