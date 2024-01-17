// Example crontab:
// * * * * * cd /home/umbrel/repo/pixoo-wall && /home/umbrel/.nvm/versions/node/v20.10.0/bin/node /home/umbrel/repo/pixoo-wall/node_modules/.bin/tsx /home/umbrel/repo/pixoo-wall/scripts/update-wall.ts >> /tmp/output 2>&1
import { getCurrentMessage } from "@/helpers/get-current-message";
import dotenv from "dotenv";
import { PixooAPI, Color } from "pixoo-api";
dotenv.config();

const MAX_LINE_CHARS = 15;
const MAX_FRAME_LINES = 5;
const VERTICAL_SPACING = 8;

const sleep = async () =>
  await new Promise((resolve) => setTimeout(resolve, 1000));
const getLinesOfText = (message: string): string[] => {
  if (message.length < MAX_LINE_CHARS) {
    return [message];
  }
  let lines = [];
  const words = message.split(" ");
  let line = "> ";
  for (const word of words) {
    line = line + " " + word;
    if (line.length >= MAX_LINE_CHARS) {
      lines.push(line);
      line = "";
    }
  }
  lines.push(line);
  if (lines.length >= MAX_FRAME_LINES) {
    lines = [" ", " ", ...lines];
  }

  return lines;
};

const main = async () => {
  console.log({ ip: process.env.PIXOO_IP! });
  const pixoo = new PixooAPI(process.env.PIXOO_IP!);
  await pixoo.initialize();
  console.log({ initialized: true });

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
    allLinesOfText.length <= MAX_FRAME_LINES
      ? allLinesOfText
      : allLinesOfText.slice(frame, MAX_FRAME_LINES + frame);
  console.log({ allLinesOfText, frameLines, frame });
  pixoo.clear();
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
