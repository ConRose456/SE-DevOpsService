import { signInResolver } from "./auth/signIn";
import { signOutResolver } from "./auth/signOut";
import { signUpResolver } from "./auth/signUp";
import { booksResolver } from "./books/books";

export const MAX_PAGE_SIZE = 21;

export default {
  Query: {
    book: (parent, args, context, info) =>
      booksResolver(parent, { ...args, ids: [args.id] }, context, info).then(
        (data) => data.edges[0].node,
      ),
    books: booksResolver,
    auth: (...args) => ({}),
  },
  Mutation: {
    signIn: signInResolver,
    signUp: signUpResolver,
    signOut: signOutResolver,
    userOwned: (...args) => ({}),
  },
};
