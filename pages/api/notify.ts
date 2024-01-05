// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  sent: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { message } = JSON.parse(req.body) as {
    message: string;
  };
  console.log({
    endpoint: "notify",
    topic: process.env.UNIQUE_NOTIFICATION_TOPIC,
  });
  const notificationMessage = `New message posted to John's wall: ${message}`;
  const fetchResponse = await fetch(
    `https://ntfy.sh/${process.env.UNIQUE_NOTIFICATION_TOPIC}`,
    {
      method: "POST", // PUT works too
      body: notificationMessage,
    }
  );
  const status = fetchResponse.status;
  const responseJson = await fetchResponse.json();
  console.log({
    nftyTopic: process.env.UNIQUE_NOTIFICATION_TOPIC,
    status,
    responseJson,
  });

  res.status(status).json({ sent: status === 200 });
}
