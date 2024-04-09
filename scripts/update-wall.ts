// Example crontab:
// * * * * * cd /home/umbrel/repo/pixoo-wall && /home/umbrel/.nvm/versions/node/v20.10.0/bin/node /home/umbrel/repo/pixoo-wall/node_modules/.bin/tsx /home/umbrel/repo/pixoo-wall/scripts/update-wall.ts >> /tmp/output 2>&1
import { getCurrentMessage, addMessage } from "@/helpers/get-current-message";
import dotenv from "dotenv";
import { PixooAPI, Color } from "pixoo-api";
import weather from "weather-js";
dotenv.config();

const MAX_LINE_CHARS = 17;
const MAX_FRAME_LINES = 5;
const VERTICAL_SPACING = 8;

const sleep = async () =>
  await new Promise((resolve) => setTimeout(resolve, 1000));

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

const getJoke = async () => {
  const jokeResponse = await fetch("https://icanhazdadjoke.com/", {
    headers: {
      Accept: "application/json",
    },
  });

  const jokeJson = await jokeResponse.json();
  return jokeJson.joke;
};

const maybeAddJoke = async () => {
  const date = new Date();
  const hour = date.getHours();
  const minute = date.getMinutes();
  // Update the board once a day
  if (hour === 0 && minute === 0) {
    const joke = await getJoke();
    await addMessage(joke);
  }
};

export const getWeather = async (zipcode: string) => {
  const weatherResponse: any = await new Promise((resolve) => {
    weather.find({ search: zipcode, degreeType: "F" }, (_: any, result: any) =>
      resolve(result)
    );
  });
  const current = weatherResponse[0].current;
  return `${current.skytext ?? "?????"} - ${current.temperature}`;
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
  const response = await fetch(url);
  return response.json();
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
  const data = await fetchData("getpredictions", {
    stpid: stopId,
    rt: busRoute,
    top: 3,
  });
  console.log({ data: data["bustime-response"].error });

  const response = data["bustime-response"].prd?.map((prediction: any) => ({
    direction: prediction.rtdir,
    route: prediction.rt,
    arrivalTime: convertBustimeToDate(prediction.prdtm).toLocaleString(),
  }));
  return response;
};
export const getBusArrivalTime = async (
  busRoute: number,
  stopId: number
): Promise<Date | null> => {
  const predictions = await predictArrivalTimes(busRoute, stopId);
  if (!predictions) {
    return null;
  }
  const prediction = predictions.pop();
  return new Date(prediction.arrivalTime);
};

const main = async () => {
  try {
    await maybeAddJoke();
  } catch (e) {
    console.log(e);
  }

  let frame = 0;
  const date = new Date();
  const hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
  const mins =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  console.log({ cleared: true });
  const mostRecentMessage = await getCurrentMessage();
  console.log({ mostRecentMessage });
  const allLinesOfText = getLinesOfText(mostRecentMessage?.content!);
  const frameLines =
    allLinesOfText.length < MAX_FRAME_LINES
      ? allLinesOfText
      : allLinesOfText.slice(frame, MAX_FRAME_LINES + frame);
  console.log({ allLinesOfText, frameLines, frame });
  console.log({ ip: process.env.PIXOO_IP! });
  const pixoo = new PixooAPI(process.env.PIXOO_IP!);
  await pixoo.initialize();
  console.log({ initialized: true });
  pixoo.drawText("Write a message!", [0, 0], Color.Green);
  const url = "wall.jpc.io";
  const divider = " - ";
  pixoo.drawText(url, [0, 7], Color.Red);
  pixoo.drawText(divider, [38, 7], Color.Blue);
  pixoo.drawText(`${hours}:${mins}`, [47, 7], Color.Coral);
  const weatherString = await getWeather("48103");
  const busArrivalTime = await getBusArrivalTime(26, 1565);
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

  pixoo.drawText("----------------", [0, 20], Color.Apricot);
  let yCoordinate = 25;
  for (const frameMessage of frameLines) {
    pixoo.drawText(frameMessage, [0, yCoordinate], Color.Gold);
    yCoordinate += VERTICAL_SPACING;
  }

  console.log({ drawn: true });
  await pixoo.push();
  console.log({ pushed: true });
  frame++;
  if (frame >= allLinesOfText.length) {
    console.log({ restart: true });
    frame = 0;
  }
  await sleep();
  console.log({ slept: true });
};
main();
