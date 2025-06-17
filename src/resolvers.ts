import merge from "lodash.merge";
import helloWorld from "./fields/hello/helloWorld";
import query from "./fields/query";

const resolversConfig = [helloWorld, query];

const resolvers = merge(...resolversConfig);

export default resolvers;
