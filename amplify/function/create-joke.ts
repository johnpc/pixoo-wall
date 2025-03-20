import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { data, Schema } from "../data/resource";
import { env } from "$amplify/env/jpc-wall-create-joke";
import { createMessage } from "./graphql/mutations";
import { generateMessage } from "./queries";
Amplify.configure(
  {
    API: {
      GraphQL: {
        endpoint: env.AMPLIFY_DATA_GRAPHQL_ENDPOINT,
        region: env.AWS_REGION,
        defaultAuthMode: "identityPool",
      },
    },
  },
  {
    Auth: {
      credentialsProvider: {
        getCredentialsAndIdentityId: async () => ({
          credentials: {
            accessKeyId: env.AWS_ACCESS_KEY_ID,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
            sessionToken: env.AWS_SESSION_TOKEN,
          },
        }),
        clearCredentialsAndIdentityId: () => {
          /* noop */
        },
      },
    },
  }
);

const dataClient = generateClient<Schema>();
const getJoke = async () => {
  const generationResponse = await dataClient.graphql({
    query: generateMessage,
  });
  console.log({
    generationResponse: generationResponse.data.generateMessage,
    errors: generationResponse.errors,
  });
  return generationResponse.data.generateMessage!.message!;
};
export const addMessage = async (content: string) => {
  const messageResult = await dataClient.graphql({
    query: createMessage,
    variables: {
      input: {
        content,
      },
    },
  });
  return messageResult;
};

export const handler = async () => {
  const joke = await getJoke();
  console.log({ joke });
  const message = await addMessage(joke);
  console.log({ message });
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message,
    }),
  };

  return response;
};
