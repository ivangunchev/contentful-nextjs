import React from "react";
import { ArticleCard } from "../ArticleCard/ArticleCard";
import { ArticleProps } from "./type";

const ArticleList = ({ articles }) => {
  return (
    <section>
      {!articles && <div>No articles</div>}
      {articles &&
        articles.map((article: ArticleProps) => (
          <ArticleCard
            key={article.sys.id}
            title={article.headline}
            slug={article.slug}
            category={article.category.name}
            image={article.image[0].url}
          />
        ))}
    </section>
  );
};

export default ArticleList;
