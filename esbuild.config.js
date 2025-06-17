import esbuild from "esbuild";
import { readFileSync } from "fs";

const graphqlLoader = {
  name: "graphql-loader",
  setup(build) {
    build.onLoad({ filter: /\.graphql$/ }, async (args) => {
      const contents = readFileSync(args.path, "utf8");
      return {
        contents: `export default ${JSON.stringify(contents)};`,
        loader: "js",
      };
    });
  },
};

esbuild
  .build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    platform: "node",
    target: "node20",
    outfile: "dist/index.js",
    sourcemap: true,
    minify: true,
    external: ["aws-sdk"], // AWS Lambda already provides aws-sdk
    plugins: [graphqlLoader],
  })
  .catch(() => process.exit(1));
