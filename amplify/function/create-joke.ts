import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { Schema } from "../data/resource";
import { env } from "$amplify/env/jpc-wall-create-joke";
Amplify.configure(
  {
    API: {
      GraphQL: {
        endpoint: "TODO", //env.< amplifyData > _GRAPHQL_ENDPOINT, // replace with your defineData name
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
  const jokeResponse = await fetch("https://icanhazdadjoke.com/", {
    headers: {
      Accept: "application/json",
    },
  });

  const jokeJson = await jokeResponse.json();
  return jokeJson.joke;
};
export const addMessage = async (content: string) => {
  return await dataClient.models.Message.create({
    content,
  });
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
