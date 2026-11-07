import { Schema } from "@/amplify/data/resource";
import { MESSAGE_TYPE } from "@/amplify/data/message-type";
import { generateClient } from "aws-amplify/api";
import { Amplify } from "aws-amplify";
import config from "../amplify_outputs.json";
Amplify.configure(config);
const client = generateClient<Schema>();

export type Message = Schema["Message"]["type"];

/**
 * Newest-first page of messages via the `listMessagesByDate` GSI.
 * One DynamoDB Query regardless of table size.
 */
export const listRecentMessages = async (limit: number): Promise<Message[]> => {
  const { data, errors } = await client.models.Message.listMessagesByDate(
    { type: MESSAGE_TYPE },
    { sortDirection: "DESC", limit },
  );
  if (errors?.length) {
    throw new Error(
      `listMessagesByDate failed: ${errors.map((e) => e.message).join("; ")}`,
    );
  }
  return data;
};

export const getCurrentMessage = async (): Promise<Message | undefined> => {
  const [mostRecentMessage] = await listRecentMessages(1);
  console.log({ mostRecentMessage });
  return mostRecentMessage;
};

export const addMessage = async (content: string) => {
  return await client.models.Message.create({
    content,
    type: MESSAGE_TYPE,
    createdAt: new Date().toISOString(),
  });
};
