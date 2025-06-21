import merge from "lodash.merge";
import query from "./fields/query";

const resolversConfig = [query];

const resolvers = merge(...resolversConfig);

export default resolvers;
