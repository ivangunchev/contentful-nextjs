import React from 'react'
import styles from './Quote.module.css'

const Quote = ({ text, author }: { text: string, author: string }) => {
    return (
        <div className={styles.quoteContainer}>
            <p className={styles.quoteText}>{text}</p>
            <span className={styles.quoteAuthor}>{author}</span>
        </div>
    )
}

export default Quote