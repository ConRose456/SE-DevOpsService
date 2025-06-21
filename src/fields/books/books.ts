import { GraphQLResolveInfo } from "graphql";
import { Book, QueryBooksArgs } from "../../generated/graphqlTypes";

export const booksResolver = (
  _sources: any,
  args: QueryBooksArgs,
  _content: any,
  _info: GraphQLResolveInfo,
): Array<Book> => {
  return args.ids.map((id) => ({
    id: id ?? "",
    title: "Harry Potter",
    authors: ["JK-Rowling"],
    images: ["url test"],
  }));
};
