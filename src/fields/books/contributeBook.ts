import { GraphQLResolveInfo } from "graphql";
import { Context } from "../../context";
import { MutationContributeBookArgs } from "../../generated/graphqlTypes";

export const contributeBookResolver = async (
  source: any,
  args: MutationContributeBookArgs,
  context: Context,
  info: GraphQLResolveInfo,
) => {
  const isAuthed = await context.isAuthed();
  const decoded = isAuthed?.decoded;

  if (decoded?.userId) {
    try {
      const data = await context.dataSources.catalogue.fetchCatalogueDocument({
        id: args.id,
        field: "book",
      });
      const bookData = data?.document;

      if (bookData) {
        return { alreadyExists: true, success: false };
      }

      const catalogueResponse = await writeToBooksCatalogue(args.id, context);

      if (catalogueResponse) {
        const response =
          await context.dataSources.catalogue.writeCatalogueDocument(
            { id: args.id, field: "book" },
            args,
          );

        if (response) {
          console.log(
            `[BOOK CONTRIBUTED] - ${decoded.userId} added book with id: ${args.id} to catalogue.`,
          );
          return { alreadyExists: false, success: true };
        } else {
          throw Error("[BOOK CONTRIBUTION FAILED] - Failed to write document");
        }
      }
      throw Error(
        "[BOOK CONTRIBUTION FAILED] - Failed to add book to global catalogue",
      );
    } catch (error) {
      console.log(
        `[ERROR] Failed to write document ${"book|" + args.id} - ${error}`,
      );
      return { alreadyExists: false, success: false };
    }
  }
  console.log(
    "[Unknown User] - User must sign in before they can contribute a book.",
  );
  return { alreadyExists: false, success: false };
};

const writeToBooksCatalogue = async (id: string, context: Context) => {
  const data = await context.dataSources.catalogue.fetchCatalogueDocument({
    id: "",
    field: "bookCatalogue",
  });
  const document = data?.document;
  const newDocument = {
    books: [...(document?.books ?? []), id],
  };

  return await context.dataSources.catalogue.writeCatalogueDocument(
    { id: "", field: "bookCatalogue" },
    newDocument,
  );
};
