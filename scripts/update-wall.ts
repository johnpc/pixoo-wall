import { getCurrentMessage } from '@/helpers/get-current-message';
import dotenv from 'dotenv';
import { PixooAPI, Color } from 'pixoo-api';
dotenv.config();

const MAX_LINE_CHARS = 15;
const MAX_FRAME_LINES = 5;
const VERTICAL_SPACING = 8;

const sleep = async () => await new Promise(resolve => setTimeout(resolve, 500));
const getLinesOfText = (message: string): string[] => {
  if (message.length < MAX_LINE_CHARS) {
    return [message];
  }
  let lines = [];
  const words = message.split(' ');
  let line = '> ';
  for (const word of words) {
    line = line + ' ' + word;
    if (line.length >= MAX_LINE_CHARS) {
      lines.push(line);
      line = '';
    }
  }
  lines.push(line);
  if (lines.length >= MAX_FRAME_LINES) {
    lines = [' ', ' ', ...lines];
  }

  return lines;
}

const main = async () => {
  console.log({ ip: process.env.PIXOO_IP! })
  const pixoo = new PixooAPI(process.env.PIXOO_IP!);
  await pixoo.initialize();
  console.log({ initialized: true });

  let frame = 0;
  do {

    pixoo.clear();
    console.log({cleared: true});
    const mostRecentMessage = await getCurrentMessage();
    console.log({mostRecentMessage});
    const allLinesOfText = getLinesOfText(mostRecentMessage?.content!);
    const frameLines = allLinesOfText.slice(frame, MAX_FRAME_LINES + frame);
    console.log({allLinesOfText});
    pixoo.drawText("Write a message!", [0, 0], Color.Green)
    pixoo.drawText("--- jpc.io/wall ---", [0, 10], Color.Red)
    pixoo.drawText("----------------", [0, 20], Color.Apricot)
    let yCoordinate = 25;
    for (const frameMessage of frameLines) {
      pixoo.drawText(frameMessage, [0, yCoordinate], Color.Purple);
      yCoordinate += VERTICAL_SPACING;
    }

    console.log({ drawn: true });
    await pixoo.push()
    console.log({ pushed: true });
    if (frame >= allLinesOfText.length) {
      console.log({ restart: true });
      frame = 0;
    }
    frame++;
    await sleep();
    console.log({ slept: true });
  } while (true);
}
main();