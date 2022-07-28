export const fetchContent = async (query: string, params?: {}) => {
  try {
    const res = await fetch(
      `https://graphql.contentful.com/content/v1/spaces/${process.env.SPACE_ID}/environments/master`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables: params,
        }),
      }
    );
    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error(
      `There was a problem retrieving entries with the query ${query}`
    );
    console.error(error);
  }
};
