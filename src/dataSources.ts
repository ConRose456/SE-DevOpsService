import { CatalogueDataSource } from "./dataSources/catalogueDataSource";

const singletonCatalogueDataSource = new CatalogueDataSource();

export type DataSources = {
  catalogue: CatalogueDataSource;
};

export const dataSources = () => ({
  catalogue: singletonCatalogueDataSource,
});
