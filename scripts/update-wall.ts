import { getCurrentMessage } from '@/helpers/get-current-message';
import dotenv from 'dotenv';
import { PixooAPI, Color } from 'pixoo-api';
dotenv.config();

const main = async () => {
	const mostRecentMessage = await getCurrentMessage();

	console.log({ip: process.env.PIXOO_IP!})
	const pixoo = new PixooAPI(process.env.PIXOO_IP!);
	await pixoo.initialize();
	console.log({initialized: true});
	pixoo.drawText(mostRecentMessage?.content!, [0, 0], Color.Green)
	console.log({drawn: true});
	await pixoo.push()
	console.log({pushed: true});
}
main();