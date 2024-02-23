import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelCommandInput,
  InvokeModelCommandOutput,
} from "@aws-sdk/client-bedrock-runtime";

export enum TextModel {
  Jurrasic2Mid = "ai21.j2-mid-v1", // https://docs.aws.amazon.com/code-library/latest/ug/bedrock-runtime_example_bedrock-runtime_InvokeJurassic2_section.html
  Jurrasic2Ultra = "ai21.j2-ultra-v1",
  TitanTextExpress = "amazon.titan-text-express-v1", // https://docs.aws.amazon.com/code-library/latest/ug/bedrock-runtime_example_bedrock-runtime_InvokeAmazonTitanImageGeneratorForTextGeneration_section.html
  TitanTextLite = "amazon.titan-text-lite-v1",
  Llama2Chat13B = "meta.llama2-13b-chat-v1", // https://docs.aws.amazon.com/code-library/latest/ug/bedrock-runtime_example_bedrock-runtime_InvokeLlama2_section.html
  Llama2Chat70B = "meta.llama2-70b-chat-v1",
  Llama213B = "meta.llama2-13b-v1",
  Llama270B = "meta.llama2-70b-v1",
}

const getRequestBody = (
  modelId: TextModel,
  prompt: string
): InvokeModelCommandInput => {
  let body = {};
  switch (modelId) {
    case TextModel.Jurrasic2Mid:
    case TextModel.Jurrasic2Ultra:
      body = {
        prompt,
        maxTokens: 300,
        temperature: 1,
      };
      break;
    case TextModel.TitanTextExpress:
    case TextModel.TitanTextLite:
      body = {
        inputText: prompt,
        textGenerationConfig: {
          temperature: 1,
          topP: 0.9,
          maxTokenCount: 300,
        },
      };
      break;
    case TextModel.Llama2Chat13B:
    case TextModel.Llama2Chat70B:
    case TextModel.Llama213B:
    case TextModel.Llama213B:
      body = {
        prompt,
        temperature: 1,
        top_p: 0.9,
        max_gen_len: 30,
      };
      break;
  }

  return {
    body: JSON.stringify(body),
    contentType: "application/json",
    modelId,
  };
};

const getResponseText = (
  modelId: TextModel,
  response: InvokeModelCommandOutput
) => {
  const jsonResponse = JSON.parse(Buffer.from(response.body).toString());
  switch (modelId) {
    case TextModel.Jurrasic2Mid:
    case TextModel.Jurrasic2Ultra:
      return jsonResponse.completions[0].data.text;
    case TextModel.TitanTextExpress:
    case TextModel.TitanTextLite:
      return jsonResponse.results[0].outputText;
    case TextModel.Llama2Chat13B:
    case TextModel.Llama2Chat70B:
    case TextModel.Llama270B:
    case TextModel.Llama213B:
      return jsonResponse.generation;
  }
};

export const getAiTextResponse = async (
  prompt: string,
  modelId: TextModel = TextModel.TitanTextExpress
): Promise<string> => {
  const client = new BedrockRuntimeClient();
  const input: InvokeModelCommandInput = getRequestBody(modelId, prompt);
  const command = new InvokeModelCommand(input);
  const response = await client.send(command);
  const outputText = getResponseText(modelId, response);
  const parsedResponse = outputText.replaceAll("\n", " ");

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
