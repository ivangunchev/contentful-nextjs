const authString = Buffer.from(
  `${process.env.BRIGHTCOVE_CLIENT_ID}:${process.env.BRIGHTCOVE_CLIENT_SECRET}`
).toString("base64");

const getAccessToken = async () => {
  try {
    const response = await fetch(
      "https://oauth.brightcove.com/v4/access_token",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${authString}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      }
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

export default getAccessToken;
