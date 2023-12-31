import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Message: a
    .model({
      content: a.string(),
    })
    .authorization([a.allow.public('iam').to(["create", "read"])]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'iam',
  },
});