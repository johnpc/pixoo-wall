import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { createJokeFunction } from "../function/resource";
const schema = a.schema({
  Message: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [
      allow.guest().to(["create", "read"]),
      allow.resource(createJokeFunction).to(["create", "read"]),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "iam",
  },
});
