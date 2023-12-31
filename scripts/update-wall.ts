import { getCurrentMessage } from '@/helpers/get-current-message';
import dotenv from 'dotenv';
import { PixooAPI, Color } from 'pixoo-api';
dotenv.config();

const MAX_LINE_CHARS = 15;
const MAX_FRAME_LINES = 5;
const VERTICAL_SPACING = 8;

const sleep = async () => await new Promise(resolve => setTimeout(resolve, 500));
const getTextFrame = (message: string, frame: number): string[] => {
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
  if (lines.length >= MAX_FRAME_LINES) {
    lines.push('');
    lines.push('');
    lines.push('');
    lines.push('');
    lines = ['', ...lines];

  }

  if (lines.length <= MAX_FRAME_LINES) {
    return lines;
  }

  return lines.slice(frame, MAX_FRAME_LINES + frame);
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
    const frameContent = getTextFrame(mostRecentMessage?.content!, frame);
    console.log({frameContent});
    pixoo.drawText("Write a message!", [0, 0], Color.Green)
    pixoo.drawText("--- jpc.io/wall ---", [0, 10], Color.Red)
    pixoo.drawText("----------------", [0, 20], Color.Apricot)
    let yCoordinate = 25;
    for (const frameMessage of frameContent) {
      pixoo.drawText(frameMessage, [0, yCoordinate], Color.Purple);
      yCoordinate += VERTICAL_SPACING;
    }

    console.log({ drawn: true });
    await pixoo.push()
    console.log({ pushed: true });
    frame++;
    if (frame >= frameContent.length) {
      console.log({ restart: true });
      frame = 0;
    }
    await sleep();
    console.log({ slept: true });
  } while (true);
}
main();