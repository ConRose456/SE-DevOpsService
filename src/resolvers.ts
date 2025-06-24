import merge from "lodash.merge";

import validity from "./fields/auth/validity";
import displayText from "./fields/auth/displayText";
import query from "./fields/query";
import addToUserBooksResolver from "./fields/ownedBooks/addToUserBooks";
import ownedBooks from "./fields/ownedBooks/getOwnedBooks";
import removeOwnedBooksResolver from "./fields/ownedBooks/removeOwnedBooks";

const resolversConfig = [
  query,
  validity,
  displayText,
  addToUserBooksResolver,
  removeOwnedBooksResolver,
  ownedBooks,
];

const resolvers = merge(...resolversConfig);

export default resolvers;
