import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "./ArticleCard.module.css";

export const ArticleCard = ({ title, slug, image, date }) => {
  return (
    <Link href={`/news/${slug}`}>
      <article className={styles.container}>
        <div className={styles.imageWrapper}>
          <Image src={image} alt={title} layout="fill" objectFit="cover" />
        </div>
        <h4 className={styles.date}>{date.slice(0, 10)}</h4>
        <h3 className={styles.title}>{title}</h3>
      </article>
    </Link>
  );
};
