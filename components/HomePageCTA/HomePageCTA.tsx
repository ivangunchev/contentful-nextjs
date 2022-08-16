import Link from "next/link";
import React from "react";
import styles from "./HomePageCTA.module.css";

const HomePageCTA = () => {
  return (
    <section className={styles.ctaContainer}>
      <div>
        <h3 className={styles.ctaTitle}>Register for the 2022 Masters!</h3>
        <p className={styles.ctaBody}>
          Registration is open for the 2022 Masters. Spaces are limited.
        </p>
      </div>
      <div className={styles.ctaLink}>
        <Link href="/">Register now</Link>
      </div>
    </section>
  );
};

export default HomePageCTA;
