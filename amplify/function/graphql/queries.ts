/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const generateMessage =
  /* GraphQL */ `query GenerateMessage($description: String) {
  generateMessage(description: $description) {
    message
    __typename
  }
}
` as GeneratedQuery<
    APITypes.GenerateMessageQueryVariables,
    APITypes.GenerateMessageQuery
  >;
export const getMessage = /* GraphQL */ `query GetMessage($id: ID!) {
  getMessage(id: $id) {
    content
    createdAt
    id
    type
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetMessageQueryVariables,
  APITypes.GetMessageQuery
>;
export const listMessages = /* GraphQL */ `query ListMessages(
  $filter: ModelMessageFilterInput
  $limit: Int
  $nextToken: String
) {
  listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      content
      createdAt
      id
      type
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMessagesQueryVariables,
  APITypes.ListMessagesQuery
>;
export const listMessagesByDate = /* GraphQL */ `query ListMessagesByDate(
  $createdAt: ModelStringKeyConditionInput
  $filter: ModelMessageFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
  $type: String!
) {
  listMessagesByDate(
    createdAt: $createdAt
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
    type: $type
  ) {
    items {
      content
      createdAt
      id
      type
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMessagesByDateQueryVariables,
  APITypes.ListMessagesByDateQuery
>;
