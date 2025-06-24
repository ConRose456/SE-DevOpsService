import { GraphQLResolveInfo } from "graphql";
import { Context } from "../../context";
import { DisplayText } from "../../generated/graphqlTypes";

export const displayTextResolver = async (
  _source: any,
  _args: any,
  context: Context,
  _info: GraphQLResolveInfo,
): Promise<DisplayText> => {
  const auth = await context.isAuthed();

  return {
    text: auth.decoded?.userId ? auth.decoded.userId : "",
  };
};

export default {
  isAuthed: {
    displayText: displayTextResolver,
  },
};
