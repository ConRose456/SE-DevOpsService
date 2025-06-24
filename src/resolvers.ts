import merge from "lodash.merge";

import validity from "./fields/auth/validity";
import displayText from "./fields/auth/displayText";
import query from "./fields/query";
import addToUserBooksResolver from "./fields/ownedBooks/addToUserBooks";

const resolversConfig = [query, validity, displayText, addToUserBooksResolver];

const resolvers = merge(...resolversConfig);

export default resolvers;
