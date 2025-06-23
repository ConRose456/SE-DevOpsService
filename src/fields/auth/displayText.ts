import { GraphQLResolveInfo } from "graphql";
import { Context } from "../../context";
import { DisplayText } from "../../generated/graphqlTypes";

export const displayTextResolver = (
  _source: any,
  _args: any,
  context: Context,
  _info: GraphQLResolveInfo,
): DisplayText => {
  const auth = context.isAuthed();

  return {
    text: auth.decoded?.userId ? auth.decoded.userId : "",
  };
};

export default {
  isAuthed: {
    displayText: displayTextResolver,
  },
};

// const secret = crypto.randomBytes(64).toString('hex'); // Example: 64 bytes, hexadecimal string
// console.log(secret);
