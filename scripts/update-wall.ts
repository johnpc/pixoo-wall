import { getCurrentMessage } from '@/helpers/get-current-message';
import dotenv from 'dotenv';
import { PixooAPI, Color } from 'pixoo-api';
dotenv.config();

const MAX_FRAME_CHARS = 40;
const sleep = async () => await new Promise(resolve => setTimeout(resolve, 500));
const getTextFrame = (message: string, frame: number) => {
  if (message.length < MAX_FRAME_CHARS) {
    return message;
  }

  return message.substring(frame, MAX_FRAME_CHARS + frame);
}

const main = async () => {
	console.log({ip: process.env.PIXOO_IP!})
	const pixoo = new PixooAPI(process.env.PIXOO_IP!);
	await pixoo.initialize();
	console.log({initialized: true});

  let frame = 0;
  do {
    pixoo.clear();
    const mostRecentMessage = await getCurrentMessage();
    const frameMessage = getTextFrame(mostRecentMessage?.content!, frame);
    pixoo.drawText("Write a message!", [0, 0], Color.Green)
    pixoo.drawText("--- jpc.io/wall ---", [0, 10], Color.Red)
    pixoo.drawText("----------------", [0, 20], Color.Apricot)
    pixoo.drawText('> ' + frameMessage, [0, 40], Color.Purple)

    console.log({drawn: true});
    await pixoo.push()
    console.log({pushed: true});
    frame++;
    if (frame >= MAX_FRAME_CHARS) {
      frame = 0;
    }
    await sleep();
  } while (true);
}
main();