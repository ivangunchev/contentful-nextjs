export type ArticleProps = {
  sys: {
    id: string;
  };
  headline: string;
  slug: string;
  category: { name: string };
  image: {
    url: string;
    height: number;
    width: number;
  };
};
