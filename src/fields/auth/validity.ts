import { Context } from "../../context";
import { Validity } from "../../generated/graphqlTypes";

export const validityResolver = async (
  source,
  args,
  context: Context,
  info,
): Promise<Validity> => {
  const auth = await context.isAuthed();
  return auth?.decoded?.userId
    ? {
        isValid: true,
        expireDate: auth?.decoded?.exp ?? "",
        isAdmin: auth?.decoded?.isAdmin ?? false,
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
