import { Context } from "../../context";
import { Validity } from "../../generated/graphqlTypes";

export const validityResolver = (
  source,
  args,
  context: Context,
  info,
): Validity => {
  const auth = context.isAuthed();
  return auth.decoded?.userId
    ? {
        isValid: true,
        expireDate: auth.decoded.exp ?? "",
        isAdmin: auth.decoded.isAdmin ?? false,
      }
    : {
        isValid: false,
        expireDate: "",
        isAdmin: false,
      };
};

export default {
  isAuthed: {
    validity: validityResolver,
  },
};
