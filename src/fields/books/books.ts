import { GraphQLResolveInfo } from "graphql";
import { Book, BookEdges, QueryBooksArgs } from "../../generated/graphqlTypes";
import { Context } from "../../context";
import { paginateResponse } from "../../utils/paginatedList";

export const booksResolver = async (
  _sources: any,
  args: QueryBooksArgs,
  context: Context,
  _info: GraphQLResolveInfo,
): Promise<BookEdges> => {
  const data = await context.dataSources.catalogue.batchFetchCatalogueDocuments(
    args.ids.map((id) => ({ id, field: "book" })),
  );

  const sortedBooks = sortBooks(data.map(({ document }) => document));

  return paginateResponse(sortedBooks, args);
};

const sortBooks = (books: Array<Book>) =>
  books.sort((a, b) => a.title.localeCompare(b.title));
