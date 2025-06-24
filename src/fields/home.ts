import { GraphQLResolveInfo } from "graphql";
import { Context } from "../context";

export const homeResolver = async (
  sources: any,
  args: any,
  context: Context,
  info: GraphQLResolveInfo,
) => {
  const data = await context.dataSources.catalogue.fetchCatalogueDocument({
    id: "",
    field: "bookCatalogue",
  });

  return Array.from(new Set(data?.document?.books ?? [])) as string[];
};
