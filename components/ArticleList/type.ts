export type Article = {
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
  publishDate: string;
  columnist?: { name: string };
  articleCopy?: any;
};

export type ArticleCardProps = {
  title: string;
  slug: string;
  image: string;
  date: string;
};

export type ArticleProps = {
  article: Article | null;
};

export type ArticlesProps = {
  articles: Article[] | null;
};
