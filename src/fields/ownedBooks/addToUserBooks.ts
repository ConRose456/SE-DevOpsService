import { GraphQLResolveInfo } from "graphql";
import { Context } from "../../context";
import { UserOwnedAddToOwnedBooksArgs } from "../../generated/graphqlTypes";

export const addToUserBooksResolver = async (
  source,
  args: UserOwnedAddToOwnedBooksArgs,
  context: Context,
  info: GraphQLResolveInfo,
) => {
  const isAuthed = await context.isAuthed();

  if (isAuthed.userId) {
    try {
      const data =
        await context.dataSources.catalogue.batchFetchCatalogueDocuments([
          { id: isAuthed.userId, field: "ownedBooks" },
        ]);

      const ownedBook = data.map(({ document }) => document)[0];
      const newDocument = createNewOwnedBooks(
        args.id,
        isAuthed.userId,
        ownedBook,
      );

      const reponse =
        await context.dataSources.catalogue.writeCatalogueDocument(
          { id: isAuthed.userId, field: "ownedBooks" },
          newDocument,
        );

      return reponse ? { success: true } : { success: false };
    } catch (error) {
      console.log(
        `[Error] Failed to write document ${"ownedBooks|" + isAuthed.userId} - ${error}`,
      );
      return { success: false };
    }
  }
  console.log("[Unknown User] - User must sign in before they can add a book.");
  return { success: false };
};

const createNewOwnedBooks = (
  newBookId: string,
  userId: string,
  ownedBook?: any,
) => {
  return ownedBook?.ownedBookIds
    ? {
        id: userId,
        ownedBookIds: [...ownedBook.ownedBookIds, newBookId],
      }
    : {
        id: userId,
        ownedBookIds: [newBookId],
      };
};

export default {
  UserOwned: {
    addToOwnedBooks: addToUserBooksResolver,
  },
};
