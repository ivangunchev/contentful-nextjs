import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import { createClient } from "contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

type ArticleProps = {
  fields: {
    slug?: string;
  };
  sys: {};
  metadata: {};
}

// Contentful client
const client = createClient({
  space: process.env.SPACE_ID,
  accessToken: process.env.ACCESS_TOKEN,
});

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await client.getEntries({
    content_type: "article",
  });

  const paths = response.items.map((item: ArticleProps) => {
    return {
      params: {
        // tslint:disable-next-line
        slug: item.fields.slug,
      },
    };
  });

  return {
    paths,
    // If fallback:true Shows 404 if the path doesn't exist
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { items } = await client.getEntries({
    content_type: "article",
    "fields.slug": params.slug,
  });

  //   Guard clause for unexisting slugs/pages, redirects to home page
  if (!items.length) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      article: items[0],
    },
    //   ISR setting in seconds
    revalidate: 60,
  };
};

const NewsArticle = ({ article }) => {
  // Loading indicator / Skeleton component while fetching data
  if (!article) return <div>Loading...</div>;

  const { title, category, richTextContent } = article.fields;
  const image = article.fields.heroImage.fields.file.url;
  return (
    <article>
      <Image src={`https:${image}`} layout="fill" objectFit="contain" />
      <h3>{title}</h3>
      <h4>{category}</h4>
      <div>{documentToReactComponents(richTextContent)}</div>
    </article>
  );
};

export default NewsArticle;
