import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import { fetchContent } from "../../utils/contentful/fetchContent";
import getLocale from "../../utils/contentful/getLocale";
import styles from "./[slug].module.css";
import {
  GET_ALL_ARTICLE_SLUGS,
  GET_ARTICLE_BY_SLUG,
} from "../../queries/contentful/graphqlQueries";

const RICH_TEXT_OPTIONS = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => {
      return <p>{children}</p>;
    },
    [INLINES.HYPERLINK]: (node, children) => {
      const { data } = node;
      return (
        <a href={data.uri} style={{ color: "darkblue" }}>
          {children}
        </a>
      );
    },
    [BLOCKS.UL_LIST]: (node, children) => {
      return <ul style={{ listStyle: "none" }}>{children}</ul>;
    },
  },
};

const NewsArticle = ({ article }) => {
  // Loading indicator / Skeleton component while fetching data
  // if (!article) return <div>Loading...</div>;

  const { headline, columnist, publishDate, image, articleCopy } = article;
  return (
    <article>
      <div className={styles.articleImage}>
        <Image
          src={image[0].url}
          alt={headline}
          layout="fill"
          objectFit="cover"
          width={image[0].width}
          height={image[0].height}
        />
      </div>
      <div className={styles.articleHeader}>
        <h2 className={styles.articleTitle}>{headline}</h2>
        <h5>
          By {columnist.name} / {publishDate.slice(0, 10)}
        </h5>
      </div>
      <div className={styles.articleBody}>
        {documentToReactComponents(articleCopy.json, RICH_TEXT_OPTIONS)}
      </div>
    </article>
  );
};

export default NewsArticle;

export const getStaticPaths: GetStaticPaths = async (locales) => {
  const data = await fetchContent(GET_ALL_ARTICLE_SLUGS);
  const articleSlugs = data.newsArticleCollection.items;

  let paths = [];
  locales.locales.forEach((locale) => {
    paths = [
      ...paths,
      ...articleSlugs.map((articleSlug) => ({
        params: { slug: articleSlug.slug },
        locale,
      })),
    ];
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const { slug } = params;
  const localeParams = getLocale(locale);
  const data = await fetchContent(GET_ARTICLE_BY_SLUG, {
    slug,
    locale: localeParams,
  });
  const [articleData] = data.newsArticleCollection.items;

  return {
    props: {
      article: articleData,
    },
    //   ISR setting in seconds
    revalidate: 5,
  };
};
