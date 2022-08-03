export const GET_ALL_ARTICLES_WITH_LOCALE = `
query ($locale: String!) {
  newsArticleCollection (locale: $locale) {
    items {
      sys {
        id
      }
      headline
      slug
      category {
        name
      }
      image 
    }
  }
}
`;

export const GET_ARTICLE_BY_SLUG = `
  query ($slug: String!, $locale: String!){
    newsArticleCollection(where:
      {slug: $slug
      }, locale: $locale) {
        items {
          headline
          slug
          articleCopy {
            json
          }
          image
          publishDate
          columnist {
            name
          }
          tagsCollection{
            items {
              name
            }
          }
        }
    }
  }
`;

export const GET_ALL_ARTICLE_SLUGS = `
query {
  newsArticleCollection {
    items {
      slug
    }
  }
}
`;
