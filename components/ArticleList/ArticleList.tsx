import React from "react";
import { ArticleCard } from "../ArticleCard/ArticleCard";
import { Article, ArticlesProps } from "./type";
import styles from "./ArticleList.module.css";

const ArticleList = ({ articles }: ArticlesProps) => {
  return (
    <section>
      <h2 className={styles.sectionTitle}>Latest News</h2>
      {articles.length === 0 && <div>No articles</div>}
      <ul className={styles.list}>
        {articles &&
          articles.map((article: Article) => (
            <li key={article.sys.id}>
              <ArticleCard
                title={article.headline}
                slug={article.slug}
                image={article.image[0].url}
                date={article.publishDate}
              />
            </li>
          ))}
      </ul>
    </section>
  );
};

export default ArticleList;
