import merge from "lodash.merge";

import validity from "./fields/auth/validity";
import displayText from "./fields/auth/displayText";
import query from "./fields/query";
import addToUserBooksResolver from "./fields/ownedBooks/addToUserBooks";
import ownedBooks from "./fields/ownedBooks/getOwnedBooks";
import removeOwnedBooksResolver from "./fields/ownedBooks/removeOwnedBooks";
import booksResolver from "./fields/books/books";
import getAllUsersResolver from "./fields/auth/getAllUsers";

const resolversConfig = [
  query,
  validity,
  displayText,
  addToUserBooksResolver,
  removeOwnedBooksResolver,
  ownedBooks,
  booksResolver,
  getAllUsersResolver,
];

const resolvers = merge(...resolversConfig);

export default resolvers;
