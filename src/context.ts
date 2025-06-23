import { DataSources } from "./dataSources";

export type Context = {
  dataSources: DataSources;
  cookies?: any;
  isAuthed: () => any;
  req?: any;
  res?: any;
  event?: any;
};

const JWT_SECRET = process.env.JWT_SECRET!;

export const context = async ({ event }) => {
  console.log({ event });
  console.log(JWT_SECRET);
  return {};
};
