import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./src/generated/combined.graphql",
  generates: {
    "./src/generated/graphqlTypes.ts": {
      plugins: ["typescript"],
    },
  },
};

export default config;
