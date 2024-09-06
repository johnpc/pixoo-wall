import { defineFunction } from "@aws-amplify/backend";

export const createJokeFunction = defineFunction({
  name: "jpc-wall-create-joke",
  entry: "./create-joke.ts",
  timeoutSeconds: 300,
  schedule: "every day",
});
