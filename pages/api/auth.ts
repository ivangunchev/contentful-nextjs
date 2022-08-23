// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import getAccessToken from "../../utils/brightcove/getAccessToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { access_token: accessToken, token_type: tokenType } =
      await getAccessToken();
    res.json(accessToken);

    const response = await fetch(
      `https://cms.api.brightcove.com/v1/accounts/${process.env.BRIGHTCOVE_ACCOUNT_ID}/videos`,
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
