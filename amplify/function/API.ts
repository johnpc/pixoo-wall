/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type GenerateMessageReturnType = {
  __typename: "GenerateMessageReturnType";
  message?: string | null;
};

export type Message = {
  __typename: "Message";
  content?: string | null;
  createdAt: string;
  id: string;
  updatedAt: string;
};

export type ModelMessageFilterInput = {
  and?: Array<ModelMessageFilterInput | null> | null;
  content?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  id?: ModelIDInput | null;
  not?: ModelMessageFilterInput | null;
  or?: Array<ModelMessageFilterInput | null> | null;
  updatedAt?: ModelStringInput | null;
};

export type ModelStringInput = {
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  beginsWith?: string | null;
  between?: Array<string | null> | null;
  contains?: string | null;
  eq?: string | null;
  ge?: string | null;
  gt?: string | null;
  le?: string | null;
  lt?: string | null;
  ne?: string | null;
  notContains?: string | null;
  size?: ModelSizeInput | null;
};

export enum ModelAttributeTypes {
  _null = "_null",
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
}

export type ModelSizeInput = {
  between?: Array<number | null> | null;
  eq?: number | null;
  ge?: number | null;
  gt?: number | null;
  le?: number | null;
  lt?: number | null;
  ne?: number | null;
};

export type ModelIDInput = {
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  beginsWith?: string | null;
  between?: Array<string | null> | null;
  contains?: string | null;
  eq?: string | null;
  ge?: string | null;
  gt?: string | null;
  le?: string | null;
  lt?: string | null;
  ne?: string | null;
  notContains?: string | null;
  size?: ModelSizeInput | null;
};

export type ModelMessageConnection = {
  __typename: "ModelMessageConnection";
  items: Array<Message | null>;
  nextToken?: string | null;
};

export type ModelMessageConditionInput = {
  and?: Array<ModelMessageConditionInput | null> | null;
  content?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  not?: ModelMessageConditionInput | null;
  or?: Array<ModelMessageConditionInput | null> | null;
  updatedAt?: ModelStringInput | null;
};

export type CreateMessageInput = {
  content?: string | null;
  id?: string | null;
};

export type DeleteMessageInput = {
  id: string;
};

export type UpdateMessageInput = {
  content?: string | null;
  id: string;
};

export type ModelSubscriptionMessageFilterInput = {
  and?: Array<ModelSubscriptionMessageFilterInput | null> | null;
  content?: ModelSubscriptionStringInput | null;
  createdAt?: ModelSubscriptionStringInput | null;
  id?: ModelSubscriptionIDInput | null;
  or?: Array<ModelSubscriptionMessageFilterInput | null> | null;
  updatedAt?: ModelSubscriptionStringInput | null;
};

export type ModelSubscriptionStringInput = {
  beginsWith?: string | null;
  between?: Array<string | null> | null;
  contains?: string | null;
  eq?: string | null;
  ge?: string | null;
  gt?: string | null;
  in?: Array<string | null> | null;
  le?: string | null;
  lt?: string | null;
  ne?: string | null;
  notContains?: string | null;
  notIn?: Array<string | null> | null;
};

export type ModelSubscriptionIDInput = {
  beginsWith?: string | null;
  between?: Array<string | null> | null;
  contains?: string | null;
  eq?: string | null;
  ge?: string | null;
  gt?: string | null;
  in?: Array<string | null> | null;
  le?: string | null;
  lt?: string | null;
  ne?: string | null;
  notContains?: string | null;
  notIn?: Array<string | null> | null;
};

export type GenerateMessageQueryVariables = {
  description?: string | null;
};

export type GenerateMessageQuery = {
  generateMessage?: {
    __typename: "GenerateMessageReturnType";
    message?: string | null;
  } | null;
};

export type GetMessageQueryVariables = {
  id: string;
};

export type GetMessageQuery = {
  getMessage?: {
    __typename: "Message";
    content?: string | null;
    createdAt: string;
    id: string;
    updatedAt: string;
  } | null;
};

export type ListMessagesQueryVariables = {
  filter?: ModelMessageFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListMessagesQuery = {
  listMessages?: {
    __typename: "ModelMessageConnection";
    items: Array<{
      __typename: "Message";
      content?: string | null;
      createdAt: string;
      id: string;
      updatedAt: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type CreateMessageMutationVariables = {
  condition?: ModelMessageConditionInput | null;
  input: CreateMessageInput;
};

export type CreateMessageMutation = {
  createMessage?: {
    __typename: "Message";
    content?: string | null;
    createdAt: string;
    id: string;
    updatedAt: string;
  } | null;
};

export type DeleteMessageMutationVariables = {
  condition?: ModelMessageConditionInput | null;
  input: DeleteMessageInput;
};

export type DeleteMessageMutation = {
  deleteMessage?: {
    __typename: "Message";
    content?: string | null;
    createdAt: string;
    id: string;
    updatedAt: string;
  } | null;
};

export type UpdateMessageMutationVariables = {
  condition?: ModelMessageConditionInput | null;
  input: UpdateMessageInput;
};

export type UpdateMessageMutation = {
  updateMessage?: {
    __typename: "Message";
    content?: string | null;
    createdAt: string;
    id: string;
    updatedAt: string;
  } | null;
};

export type OnCreateMessageSubscriptionVariables = {
  filter?: ModelSubscriptionMessageFilterInput | null;
};

export type OnCreateMessageSubscription = {
  onCreateMessage?: {
    __typename: "Message";
    content?: string | null;
    createdAt: string;
    id: string;
    updatedAt: string;
  } | null;
};

export type OnDeleteMessageSubscriptionVariables = {
  filter?: ModelSubscriptionMessageFilterInput | null;
};

export type OnDeleteMessageSubscription = {
  onDeleteMessage?: {
    __typename: "Message";
    content?: string | null;
    createdAt: string;
    id: string;
    updatedAt: string;
  } | null;
};

export type OnUpdateMessageSubscriptionVariables = {
  filter?: ModelSubscriptionMessageFilterInput | null;
};

export type OnUpdateMessageSubscription = {
  onUpdateMessage?: {
    __typename: "Message";
    content?: string | null;
    createdAt: string;
    id: string;
    updatedAt: string;
  } | null;
};
