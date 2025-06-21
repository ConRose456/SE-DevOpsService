import { booksResolver } from "./books/books";

export default {
  Query: {
    book: (parent, args, context, info) =>
      booksResolver(parent, { ids: [args.id] }, context, info)[0],
    books: booksResolver,
  },
};
