import Image from "next/image";
import Link from "next/link";
import React from "react";

type ArticleProps = {
  title: string;
  slug: string;
  category: string;
  image: string;
};

export const ArticleCard = ({ title, slug, category, image }: ArticleProps) => {
  return (
    <Link href={`/news/${slug}`}>
      <article>
        <Image src={`https:${image}`} width={100} height={100} />
        <h3>{title}</h3>
        <h4>{category}</h4>
      </article>
    </Link>
  );
};
