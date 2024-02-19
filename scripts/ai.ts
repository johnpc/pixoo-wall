import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelCommandInput,
} from "@aws-sdk/client-bedrock-runtime";

export const getAiTextResponse = async (prompt: string): Promise<string> => {
  const client = new BedrockRuntimeClient();
  const input: InvokeModelCommandInput = {
    body: JSON.stringify({
      inputText: prompt,
      textGenerationConfig: {
        temperature: 0.5,
        topP: 0.9,
        maxTokenCount: 300,
      },
    }),
    contentType: "application/json",
    modelId: "amazon.titan-text-express-v1",
  };

  const command = new InvokeModelCommand(input);
  const response = await client.send(command);
  const parsedResponse = JSON.parse(
    Buffer.from(response.body).toString()
  ).results[0].outputText.replaceAll("\n", " ");

  if (parsedResponse.includes('"')) {
    return parsedResponse.match(/".*"/)[0];
  }
  if (parsedResponse.includes(":")) {
    return parsedResponse.match(/:(.*)/)[0];
  }
  return parsedResponse.trim();
};

export const getAiImageBase64Response = async (
  prompt: string
): Promise<string> => {
  const client = new BedrockRuntimeClient();
  const input: InvokeModelCommandInput = {
    body: JSON.stringify({
      taskType: "TEXT_IMAGE",
      textToImageParams: {
        text: prompt,
        negativeText: "text words letters",
      },
      imageGenerationConfig: {
        numberOfImages: 1,
        quality: "standard",
        height: 768,
        width: 1280,
        // cfgScale: float,
        // seed: int,
      },
    }),
    contentType: "application/json",
    modelId: "amazon.titan-image-generator-v1",
  };

  const command = new InvokeModelCommand(input);
  const response = await client.send(command);
  return JSON.parse(Buffer.from(response.body).toString()).images[0];
};
