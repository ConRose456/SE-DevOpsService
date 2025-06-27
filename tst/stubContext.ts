import { StubAuthDataSource } from "../src/dataSources/authDataSource";
import { StubCatalogueDataSource } from "../src/dataSources/catalogueDataSource";

const stubCatalogueDataSource = new StubCatalogueDataSource();

export const stubContext = {
  dataSources: {
    catalogue: stubCatalogueDataSource,
    auth: new StubAuthDataSource(),
  },
  isAuthed: () => ({ decoded: { userId: "test-user" } }),
};
