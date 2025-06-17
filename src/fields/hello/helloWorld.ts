import { World } from "../../generated/graphqlTypes";

const worldResolver = (): World => ({
  id: "world-id",
  text: "Hello, World!!  " + Math.round(Math.random() * 10),
});

export default {
  Hello: {
    world: worldResolver,
  },
};
