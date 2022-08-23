// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import getAccessToken from "../../../utils/brightcove/getAccessToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  try {
    const { access_token: accessToken, token_type: tokenType } =
      await getAccessToken();
    res.json({ accessToken, tokenType });

    const response = await fetch(
      `https://cms.api.brightcove.com/v1/accounts/${process.env.BRIGHTCOVE_ACCOUNT_ID}/folders`,
      {
        headers: {
          Authorization: `${tokenType} ${accessToken}`,
        },
      }
    );
    res.json({ response: "ok" });
    res.json(await response.json());
  } catch (err) {
    console.error(err);
  }
}
