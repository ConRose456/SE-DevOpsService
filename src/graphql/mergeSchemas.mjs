import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { writeFileSync, mkdirSync } from "fs";
import { print } from "graphql";

const typesArray = loadFilesSync("../**/*.graphql");
const mergedTypes = mergeTypeDefs(typesArray, { all: true });

mkdirSync("./src/generated", { recursive: true });
writeFileSync("./src/generated/combined.graphql", print(mergedTypes));
console.log("✅ Combined GraphQL schema written to combined.graphql");
