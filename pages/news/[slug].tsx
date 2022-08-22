import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
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
import { Article } from "../../components/ArticleList/type";
import Quote from "../../components/Quote/Quote";

// const RICH_TEXT_OPTIONS = {
//   renderNode: {
//     [BLOCKS.PARAGRAPH]: (node, children) => {
//       return <p>{children}</p>;
//     },
//     [INLINES.HYPERLINK]: (node, children) => {
//       const { data } = node;
//       return (
//         <a href={data.uri} style={{ color: "darkblue" }}>
//           {children}
//         </a>
//       );
//     },
//     [BLOCKS.UL_LIST]: (_node, children) => {
//       return <ul style={{ listStyle: "none" }}>{children}</ul>;
//     },
//   },
// };

// Create a bespoke renderOptions object to target BLOCKS.EMBEDDED_ENTRY (linked block entries e.g. code blocks)
// INLINES.EMBEDDED_ENTRY (linked inline entries e.g. a reference to another blog post)
// and BLOCKS.EMBEDDED_ASSET (linked assets e.g. images)

function renderOptions(links: any) {
  // create an entry map
  const entryMap = new Map();
  // loop through the block linked entries and add them to the map
  links.entries.block.forEach((entry) => entryMap.set(entry.sys.id, entry));

  // // loop through the inline linked entries and add them to the map
  // links.entries.inline.forEach((entry) => entryMap.set(entry.sys.id, entry));

  return {
    renderNode: {
      [BLOCKS.EMBEDDED_ENTRY]: (node) => {
        // find the entry in the entryMap by ID
        const { data } = node;
        const entry = entryMap.get(data.target.sys.id);

        // render the entries as needed
        // eslint-disable-next-line no-underscore-dangle
        if (entry.__typename === "Quote") {
          return <Quote text={entry.text} author={entry.author} />;
        }
      },
      [BLOCKS.PARAGRAPH]: (_node, children) => {
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
      [BLOCKS.UL_LIST]: (_node, children) => {
        return <ul style={{ listStyle: "none" }}>{children}</ul>;
      },
    },
  };
}

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const { slug } = params;
  const localeParams = getLocale(locale);
  const data = await fetchContent(GET_ARTICLE_BY_SLUG, {
    slug,
    locale: localeParams,
  });
  const articleData: Article | null = data.newsArticleCollection.items[0];
  return {
    props: {
      article: articleData,
    },
    //   ISR setting in seconds
    // revalidate: 5,
  };
};

const NewsArticle = ({
  article,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  if (!article) return <div>Nada</div>;
  const { headline, columnist, publishDate, image, articleCopy } = article;
  // const {author, text} = article.articleCopy.links.entries.block[0];
  return (
    <article>
      <div className={styles.articleImage}>
        <Image
          src={image[0].url}
          alt={headline}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className={styles.articleHeader}>
        <h2 className={styles.articleTitle}>{headline}</h2>
        <h5>
          By {columnist.name} / {publishDate.slice(0, 10)}
        </h5>
      </div>
      <div className={styles.articleBody}>
        {documentToReactComponents(
          articleCopy.json,
          renderOptions(articleCopy.links)
        )}
      </div>
    </article>
  );
};

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

export default NewsArticle;
