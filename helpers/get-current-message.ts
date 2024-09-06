import { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { Amplify } from "aws-amplify";
import config from "../amplify_outputs.json";
Amplify.configure(config);
const client = generateClient<Schema>();

export const getCurrentMessage = async () => {
  const allMessages: Schema["Message"]["type"][] = [];
  // TODO add @index to sort by and only fetch most recent message
  // https://docs.amplify.aws/react/build-a-backend/graphqlapi/best-practice/query-with-sorting/
  let next;
  do {
    const listMessagesResponse: any = await client.models.Message.list({
      nextToken: next,
    });
    next = listMessagesResponse.nextToken;
    allMessages.push(...listMessagesResponse.data);
    console.log({
      errors: listMessagesResponse.errors,
      next,
      length: listMessagesResponse.data.length,
    });
  } while (next);
  console.log({ allMessages });

  const mostRecentMessage = allMessages
    .sort((a, b) =>
      new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime() ? 1 : -1
    )
    .pop();
  console.log({ mostRecentMessage });
  return mostRecentMessage;
};

export const addMessage = async (content: string) => {
  return await client.models.Message.create({
    content,
  });
};
