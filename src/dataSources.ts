import {
  CatalogueDataSource,
  ICatalogueDataSource,
} from "./dataSources/catalogueDataSource";

const singletonCatalogueDataSource = new CatalogueDataSource();

export type DataSources = {
  catalogue: ICatalogueDataSource;
};

export const dataSources = () => ({
  catalogue: singletonCatalogueDataSource,
});
