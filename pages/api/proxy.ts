import { NextApiRequest, NextApiResponse } from "next";

function extractApiRoute(req) {
  return `${req.params["0"]}?${new URLSearchParams(req.query).toString()}`;
}

function getAccessToken(clientId, clientSecret) {
  const encodedData = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  return fetch("https://oauth.brightcove.com/v4/access_token", {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${encodedData}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  }).then((response) => response.json());
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // eslint-disable-next-line camelcase
    const { access_token, token_type } = await getAccessToken(
      process.env.BRIGHTCOVE_CLIENT_ID,
      process.env.BRIGHTCOVE_CLIENT_SECRET
    );

    const response = await fetch(
      `https://cms.api.brightcove.com/v1/accounts/${
        process.env.BRIGHTCOVE_ACCOUNT_ID
      }/${extractApiRoute(req)}`,
      {
        headers: {
          // eslint-disable-next-line camelcase
          Authorization: `${token_type} ${access_token}`,
        },
      }
    );
    res.json({ response: "ok" });
    res.json(await response.json());
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send("Error with the proxy");
  }
}
