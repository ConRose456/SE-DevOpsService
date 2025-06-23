import merge from "lodash.merge";

import validity from "./fields/auth/validity";
import displayText from "./fields/auth/displayText";
import query from "./fields/query";

const resolversConfig = [query, validity, displayText];

const resolvers = merge(...resolversConfig);

export default resolvers;
