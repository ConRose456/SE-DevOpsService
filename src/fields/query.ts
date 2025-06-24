import { signInResolver } from "./auth/signIn";
import { signOutResolver } from "./auth/signOut";
import { signUpResolver } from "./auth/signUp";
import { booksResolver } from "./books/books";
import { contributeBookResolver } from "./books/contributeBook";
import { homeResolver } from "./home";
import { getOwnedBooks } from "./ownedBooks/getOwnedBooks";

export const MAX_PAGE_SIZE = 21;

export default {
  Query: {
    home: homeResolver,
    book: (parent, args, context, info) =>
      booksResolver(parent, { ...args, ids: [args.id] }, context, info).then(
        (data) => data.edges[0].node,
      ),
    books: booksResolver,
    ownedBooks: getOwnedBooks,
    auth: (...args) => ({}),
  },
  Mutation: {
    signIn: signInResolver,
    signUp: signUpResolver,
    signOut: signOutResolver,
    userOwned: (...args) => ({}),
    contributeBook: contributeBookResolver,
  },
};
