/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateMessage =
  /* GraphQL */ `subscription OnCreateMessage($filter: ModelSubscriptionMessageFilterInput) {
  onCreateMessage(filter: $filter) {
    content
    createdAt
    id
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
    APITypes.OnCreateMessageSubscriptionVariables,
    APITypes.OnCreateMessageSubscription
  >;
export const onDeleteMessage =
  /* GraphQL */ `subscription OnDeleteMessage($filter: ModelSubscriptionMessageFilterInput) {
  onDeleteMessage(filter: $filter) {
    content
    createdAt
    id
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
    APITypes.OnDeleteMessageSubscriptionVariables,
    APITypes.OnDeleteMessageSubscription
  >;
export const onUpdateMessage =
  /* GraphQL */ `subscription OnUpdateMessage($filter: ModelSubscriptionMessageFilterInput) {
  onUpdateMessage(filter: $filter) {
    content
    createdAt
    id
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
    APITypes.OnUpdateMessageSubscriptionVariables,
    APITypes.OnUpdateMessageSubscription
  >;
