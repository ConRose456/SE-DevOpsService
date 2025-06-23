import { AuthDataSource, IAuthDataSource } from "./dataSources/authDataSource";
import {
  CatalogueDataSource,
  ICatalogueDataSource,
} from "./dataSources/catalogueDataSource";

const singletonCatalogueDataSource = new CatalogueDataSource();

export type DataSources = {
  catalogue: ICatalogueDataSource;
  auth: IAuthDataSource;
};

export const dataSources = () => ({
  catalogue: singletonCatalogueDataSource,
  auth: new AuthDataSource(),
});
