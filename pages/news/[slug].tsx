import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import { fetchContent } from "../../utils/contentful/fetchContent";
import getLocale from "../../utils/contentful/getLocale";

const GET_ARTICLE_BY_SLUG = `
  query ($slug: String!, $locale: String!){
    articleCollection(where:
      {slug: $slug
      }, locale: $locale) {
      items {
        title
        slug
        category
        heroImage {
          url
          width
          height
        }
        richTextContent {
          json
        }
      }
    }
  }
`;

const GET_ALL_ARTICLE_SLUGS = `
query {
  articleCollection {
    items {
      slug
    }
  }
}
`;

export const getStaticPaths: GetStaticPaths = async (locales) => {
  const data = await fetchContent(GET_ALL_ARTICLE_SLUGS);
  const articleSlugs = data.articleCollection.items;

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
  const [articleData] = data.articleCollection.items;

  return {
    props: {
      article: articleData,
    },
    //   ISR setting in seconds
    revalidate: 5,
  };
};

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
  if (!article) return <div>Loading...</div>;

  const { title, category, heroImage, richTextContent } = article;
  return (
    <article>
      <div className="image--wrapper">
        <Image
          src={heroImage.url}
          alt={title}
          // layout="responsive"
          width={heroImage.width}
          height={heroImage.height}
        />
      </div>
      <h3>{title}</h3>
      <h4>{category}</h4>
      {documentToReactComponents(richTextContent.json, RICH_TEXT_OPTIONS)}
    </article>
  );
};

export default NewsArticle;
