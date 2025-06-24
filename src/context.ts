import { DataSources } from "./dataSources";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { AuthDataSource } from "./dataSources/authDataSource";

export const globalCookie = {
  value: "",
};

export type Context = {
  dataSources: DataSources;
  cookies?: any;
  isAuthed: () => any;
  setCookie: (tokenName: string, token: string) => any;
  express: any;
  req?: any;
  res?: any;
  event?: any;
};

export const context = async ({ event, express }) => {
  return {
    isAuthed: isValidJWT(event),
    setCookie: getSetCookieCallback(),
    event,
    express,
  };
};

const isValidJWT = (event) => {
  return async () => {
    try {
      const authDataSource = new AuthDataSource();
      const reqCookies = event?.cookies ?? [];

      const secret =
        process.env.LOCAL_SECRET ?? (await authDataSource.fetchJwtSecret());
      const token = parseCookies("bw-jwt-auth-token", reqCookies);

      const decoded = jwt.verify(token, secret);
      return { decoded };
    } catch (error) {
      console.log("[Invalid Credenitals] - JWT is invalid or expired: ", error);
    }
  };
};

const getSetCookieCallback = () => {
  return (tokenName: string, token: string) => {
    globalCookie.value = `${tokenName}=${token}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=3600`;
  };
};

const parseCookies = (value: string, reqCookies: string[]) => {
  const cookies = reqCookies.map((reqCookie) => ({
    ...cookie.parse(reqCookie),
  }));

  const jwtCookie = cookies.filter((reqCookie) => reqCookie[value])[0];
  return Object.values(jwtCookie)[0];
};
