import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { createJokeFunction } from "../function/resource";
const schema = a
  .schema({
    Message: a
      .model({
        content: a.string(),
      })
      .authorization((allow) => [allow.guest().to(["create", "read"])]),
    generateMessage: a
      .generation({
        aiModel: a.ai.model("Claude 3.5 Sonnet"),
        systemPrompt:
          "You write fun random messages to put up on the wall. All messages must be less than twelve words",
        inferenceConfiguration: {
          maxTokens: 200,
          temperature: 1,
          topP: 0.9,
        },
        // Tools are not supported for `a.generation` yet
        // tools: [
        //   {
        //     query: a.ref('listMessages'),
        //     description: 'Messages submitted by users.'
        //   },
        // ]
      })
      .arguments({
        description: a.string(),
      })
      .returns(
        a.customType({
          message: a.string(),
        })
      )
      .authorization((allow) => allow.guest()),
  })
  .authorization((allow) =>
    allow.resource(createJokeFunction).to(["query", "mutate", "listen"])
  );

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "iam",
  },
});
