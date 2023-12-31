// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  sent: boolean
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log({endpoint: 'notify'});
  const notificationMessage = 'New message posted to John\'s wall';
  fetch(`https://ntfy.sh/${process.env.UNIQUE_NOTIFICATION_TOPIC}`, {
    method: "POST", // PUT works too
    body: notificationMessage,
  });

  res.status(200).json({ sent: true })
}
