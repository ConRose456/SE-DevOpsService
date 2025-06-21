import { GraphQLResolveInfo } from "graphql";
import { Book, QueryBooksArgs } from "../../generated/graphqlTypes";
import { Context } from "../../context";

export const booksResolver = async (
  _sources: any,
  args: QueryBooksArgs,
  context: Context,
  _info: GraphQLResolveInfo,
): Promise<Array<Book>> => {
  const data = await context.dataSources.catalogue.batchFetchCatalogueDocuments(
    args.ids.map((id) => ({ id, field: "book" })),
  );

  console.log(JSON.stringify(data, null, 2));
  return data.map(({ document }) => document);
};
