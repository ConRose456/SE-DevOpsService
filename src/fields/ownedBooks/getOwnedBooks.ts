import { GraphQLResolveInfo } from "graphql";
import { Context } from "../../context";
import { booksResolver } from "../books/books";

export const getOwnedBooks = async (
  source,
  args,
  context: Context,
  info: GraphQLResolveInfo,
) => {
  const isAuthed = await context.isAuthed();

  if (isAuthed?.decoded?.userId) {
    const data = await context.dataSources.catalogue.fetchCatalogueDocument({
      id: isAuthed.decoded.userId,
      field: "ownedBooks",
    });

    const ownedBookIds = Array.from(
      new Set(data?.document?.ownedBookIds ?? []),
    ) as string[];
    return ownedBookIds;
  }
  return [];
};

export default {
  OwnedBooks: {
    books: booksResolver,
  },
};
