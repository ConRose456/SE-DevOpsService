import { GraphQLResolveInfo } from "graphql";
import {
  Book,
  BookEdges,
  BooksFilter,
  QueryBooksArgs,
} from "../../generated/graphqlTypes";
import { Context } from "../../context";
import { paginateResponse } from "../../utils/paginatedList";

export const booksResolver = async (
  sources: string[],
  args: QueryBooksArgs,
  context: Context,
  _info: GraphQLResolveInfo,
): Promise<BookEdges> => {
  const ids = sources?.length ? sources : args.ids;

  if (!ids.length) {
    return { total: 0, edges: [], hasNext: false };
  }
  const data = await context.dataSources.catalogue.batchFetchCatalogueDocuments(
    ids.map((id) => ({ id, field: "book" })),
  );

  const books = data.map(({ document }) => document);

  const filterdBooks = filterBooks(books, args.filter);
  const sortedBooks = sortBooks(filterdBooks);

  return paginateResponse(sortedBooks, args);
};

const filterBooks = (books: Array<Book>, filter: BooksFilter) => {
  if (!filter?.titleText) {
    return books;
  }
  const lowerCaseQuery = filter.titleText.toLowerCase();

  return books.filter((book) =>
    book.title.toLowerCase().includes(lowerCaseQuery),
  );
};

const sortBooks = (books: Array<Book>) =>
  books.sort((a, b) => a.title.localeCompare(b.title));
