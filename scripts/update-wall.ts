// Example crontab:
// * * * * * cd /home/umbrel/repo/pixoo-wall && /home/umbrel/.nvm/versions/node/v20.10.0/bin/node /home/umbrel/repo/pixoo-wall/node_modules/.bin/tsx /home/umbrel/repo/pixoo-wall/scripts/update-wall.ts >> /tmp/output 2>&1
import { getCurrentMessage, addMessage } from "@/helpers/get-current-message";
import dotenv from "dotenv";
import { PixooAPI, Color } from "pixoo-api";
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

const main = async () => {
  await maybeAddJoke();

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
  const url = "jpc.io/wall";
  const divider = " - ";
  pixoo.drawText(url, [0, 10], Color.Red);
  pixoo.drawText(divider, [38, 10], Color.Blue);
  pixoo.drawText(`${hours}:${mins}`, [47, 10], Color.Coral);
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
