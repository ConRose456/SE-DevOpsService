import { GraphQLResolveInfo } from "graphql";
import { Context } from "../../context";
import { UserOwnedAddToOwnedBooksArgs } from "../../generated/graphqlTypes";

export const removeFromUserBooksResolver = async (
  source,
  args: UserOwnedAddToOwnedBooksArgs,
  context: Context,
  info: GraphQLResolveInfo,
) => {
  const isAuthed = await context.isAuthed();
  const decoded = isAuthed?.decoded;

  if (decoded?.userId) {
    try {
      const data =
        await context.dataSources.catalogue.batchFetchCatalogueDocuments([
          { id: decoded.userId, field: "ownedBooks" },
        ]);

      const ownedBook = data.map(({ document }) => document)[0];
      const newDocument = {
        ...ownedBook,
        ownedBookIds:
          ownedBook?.ownedBookIds?.filter((bookId) => bookId != args.id) ?? [],
      };

      const reponse =
        await context.dataSources.catalogue.writeCatalogueDocument(
          { id: decoded.userId, field: "ownedBooks" },
          newDocument,
        );

      if (reponse) {
        console.log(
          `[BOOK REMOVED FROM COLLECTION] - ${decoded.userId} removed book with id: ${args.id} from thier collection.`,
        );
        return { success: true };
      }
      throw Error("Failed to write document");
    } catch (error) {
      console.log(
        `[Error] Failed to write document ${"ownedBooks|" + decoded.userId} - ${error}`,
      );
      return { success: false };
    }
  }
  console.log(
    "[Unknown User] - User must sign in before they can remove a book.",
  );
  return { success: false };
};

export default {
  UserOwned: {
    removeFromOwnedBooks: removeFromUserBooksResolver,
  },
};
