import { getCurrentMessage } from "@/helpers/get-current-message";
import dotenv from "dotenv";
import { PixooAPI, Color } from "pixoo-api";
import weather from "weather-js";
dotenv.config();

const MAX_LINE_CHARS = 17;
const MAX_FRAME_LINES = 5;
const VERTICAL_SPACING = 8;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // milliseconds

const sleep = async (ms = 1000) =>
  await new Promise((resolve) => setTimeout(resolve, ms));

// Retry wrapper function for async operations
async function withRetry<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = RETRY_DELAY,
  operationName = "operation"
): Promise<T> {
  let lastError: any;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.error(
        `${operationName} failed (attempt ${attempt}/${retries}):`,
        error
      );

      if (attempt < retries) {
        console.log(`Retrying ${operationName} in ${delay}ms...`);
        await sleep(delay);
        // Increase delay for next retry (exponential backoff)
        delay *= 1.5;
      }
    }
  }

  throw new Error(
    `${operationName} failed after ${retries} attempts: ${
      lastError?.message || "Unknown error"
    }`
  );
}

function* chunks(s: string, chunkSize: number) {
  const arr = s.split("");
  for (let i = 0; i < arr.length; i += chunkSize) {
    yield arr.slice(i, i + chunkSize);
  }
}

const getLinesOfText = (message: string): string[] => {
  // @ts-ignore
  return [...chunks(message, MAX_LINE_CHARS)].map((line) => line.join(""));
};

export const getWeather = async (zipcode: string): Promise<string> => {
  try {
    const weatherResponse: any = await withRetry(
      () =>
        new Promise((resolve, reject) => {
          weather.find(
            { search: zipcode, degreeType: "F" },
            (err: any, result: any) => {
              if (err) reject(err);
              else resolve(result);
            }
          );
        }),
      MAX_RETRIES,
      RETRY_DELAY,
      "weather fetch"
    );

    if (
      !weatherResponse ||
      !weatherResponse[0] ||
      !weatherResponse[0].current
    ) {
      return "Weather N/A";
    }

    const current = weatherResponse[0].current;
    const mainWeatherDescription = (current.skytext ?? "?????")
      .split(" ")
      .pop();
    return `${mainWeatherDescription} - ${current.temperature}`;
  } catch (error) {
    console.error("Failed to get weather:", error);
    return "Weather Error";
  }
};

const AATA_BASE_URL = "https://rt.theride.org/bustime/api/v3";

const fetchData = async (
  endpoint: string,
  args?: { [key: string]: string | number }
) => {
  const allArgs = {
    ...(args ?? {}),
    key: process.env.AATA_API_KEY,
    format: "json",
  } as { [key: string]: string };

  const url = encodeURI(
    AATA_BASE_URL +
      `/${endpoint}?` +
      Object.keys(allArgs)
        .map((key) => `${key}=${allArgs[key]}`)
        .join("&")
  );

  return withRetry(
    async () => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `HTTP error ${response.status}: ${response.statusText}`
        );
      }
      return response.json();
    },
    MAX_RETRIES,
    RETRY_DELAY,
    `API fetch ${endpoint}`
  );
};

const convertBustimeToDate = (bustime: string): Date => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const year = bustime.substring(0, 4);
  const month = bustime.substring(4, 6);
  const day = bustime.substring(6, 8);
  const hour = bustime.substring(9, 11);
  const minute = bustime.substring(12, 14);
  const dateString = `${day} ${
    months[parseInt(month) - 1]
  } ${year} ${hour}:${minute}:00`;
  const timestamp = Date.parse(dateString);
  return new Date(timestamp);
};

export const predictArrivalTimes = async (busRoute: number, stopId: number) => {
  try {
    const data = await fetchData("getpredictions", {
      stpid: stopId,
      rt: busRoute,
      top: 3,
    });

    if (data["bustime-response"].error) {
      console.log({ error: data["bustime-response"].error });
      return null;
    }

    const predictions = data["bustime-response"].prd;
    if (!predictions || predictions.length === 0) {
      return null;
    }

    return predictions.map((prediction: any) => ({
      direction: prediction.rtdir,
      route: prediction.rt,
      arrivalTime: convertBustimeToDate(prediction.prdtm).toLocaleString(),
    }));
  } catch (error) {
    console.error("Failed to predict arrival times:", error);
    return null;
  }
};

export const getBusArrivalTime = async (
  busRoute: number,
  stopId: number
): Promise<Date | null> => {
  try {
    const predictions = await predictArrivalTimes(busRoute, stopId);
    if (!predictions || predictions.length === 0) {
      return null;
    }

    const prediction = predictions.pop();
    return new Date(prediction.arrivalTime);
  } catch (error) {
    console.error("Failed to get bus arrival time:", error);
    return null;
  }
};

const drawErrorScreen = async (errorMessage: string): Promise<void> => {
  try {
    const pixoo = await initializePixoo();
    if (!pixoo) {
      console.error("Failed to initialize Pixoo device - exiting");
      return;
    }
    pixoo.drawText("ERROR", [15, 10], Color.Red);
    pixoo.drawText("----------------", [0, 20], Color.Red);

    const errorLines = getLinesOfText(errorMessage);
    let yCoordinate = 28;
    for (let i = 0; i < Math.min(errorLines.length, 3); i++) {
      pixoo.drawText(errorLines[i], [0, yCoordinate], Color.White);
      yCoordinate += VERTICAL_SPACING;
    }

    await withRetry(
      async () => await pixoo.push(),
      MAX_RETRIES,
      RETRY_DELAY,
      "error display push"
    );
  } catch (err) {
    console.error("Failed to draw error screen:", err);
  }
};

const initializePixoo = async (): Promise<PixooAPI | null> => {
  if (!process.env.PIXOO_IP) {
    console.error("PIXOO_IP environment variable not set");
    return null;
  }

  try {
    const pixoo = new PixooAPI(process.env.PIXOO_IP);
    await withRetry(
      async () => await pixoo.initialize(),
      MAX_RETRIES,
      RETRY_DELAY,
      "Pixoo initialization"
    );
    return pixoo;
  } catch (error) {
    console.error("Failed to initialize Pixoo:", error);
    return null;
  }
};

const main = async () => {
  let frame = 0;

  try {
    // Get current date and time
    const date = new Date();
    const hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    const mins =
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

    // Get message content with retry
    console.log("Fetching message...");
    const mostRecentMessage = await withRetry(
      () => getCurrentMessage(),
      MAX_RETRIES,
      RETRY_DELAY,
      "message fetch"
    );

    // Get weather data
    console.log("Fetching weather...");
    const weatherString = await withRetry(
      () => getWeather("48103"),
      MAX_RETRIES,
      RETRY_DELAY,
      "weather fetch"
    );

    // Get bus arrival time
    console.log("Fetching bus arrival times...");
    const busArrivalTime = await withRetry(
      () => getBusArrivalTime(26, 1565),
      MAX_RETRIES,
      RETRY_DELAY,
      "bus arrival fetch"
    );

    // Prepare text for display
    const allLinesOfText = getLinesOfText(mostRecentMessage!.content!);
    const frameLines =
      allLinesOfText.length < MAX_FRAME_LINES
        ? allLinesOfText
        : allLinesOfText.slice(frame, MAX_FRAME_LINES + frame);
    console.log({ allLinesOfText, frameLines, frame });
    // Initialize Pixoo device
    console.log("Initializing Pixoo...");
    const pixoo = await initializePixoo();
    if (!pixoo) {
      console.error("Failed to initialize Pixoo device - exiting");
      return;
    }
    try {
      console.log({ initialized: true });

      // Draw header text
      pixoo.drawText("Write a message!", [0, 0], Color.Green);
      const url = "wall.jpc.io";
      const divider = " - ";
      pixoo.drawText(url, [0, 7], Color.Red);
      pixoo.drawText(divider, [38, 7], Color.Blue);
      pixoo.drawText(`${hours}:${mins}`, [47, 7], Color.Coral);

      // Draw weather and bus info
      if (busArrivalTime) {
        pixoo.drawText(
          `${weatherString} @${busArrivalTime
            .toLocaleTimeString()
            .split(":")
            .slice(0, 2)
            .join(":")}`,
          [0, 14],
          [150, 250, 150] as any
        );
      } else {
        pixoo.drawText(weatherString, [0, 14], [150, 250, 150] as any);
      }

      // Draw separator
      pixoo.drawText("----------------", [0, 20], Color.Apricot);

      // Draw message content
      let yCoordinate = 25;
      for (const frameMessage of frameLines) {
        pixoo.drawText(frameMessage, [0, yCoordinate], Color.Gold);
        yCoordinate += VERTICAL_SPACING;
      }

      // Push to device with retry
      console.log("Pushing to Pixoo display...");
      await withRetry(
        async () => await pixoo.push(),
        MAX_RETRIES,
        RETRY_DELAY,
        "Pixoo display push"
      );
      console.log({ pushed: true });

      // Update frame for next run
      frame++;
      if (frame >= allLinesOfText.length) {
        console.log({ restart: true });
        frame = 0;
      }

      // Wait before next update
      await sleep();
      console.log({ slept: true });
    } catch (error) {
      console.error("Error during display update:", error);
      await drawErrorScreen(
        (error as Error)?.message ?? "Error during display update"
      );
    }
  } catch (error) {
    console.error("Critical error in main function:", error);
    // We can't use drawErrorScreen here as pixoo might not be initialized
    console.error("FATAL: Cannot recover from this error");
    await drawErrorScreen(
      (error as Error)?.message ?? "FATAL: Cannot recover from this error"
    );
  }
};

main();
