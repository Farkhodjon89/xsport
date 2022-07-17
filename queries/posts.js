import gql from "graphql-tag";

export const DATA_FOR_POSTS = gql`
  query Posts {
    posts {
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        databaseId
        date
        title
        slug
        content
        excerpt
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

export const POSTS = gql`
  query Posts($first: Int, $after: String) {
    posts(first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        databaseId
        date
        title
        slug
        content
        excerpt
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

export const POST_BY_SLUG = gql`
  query Post($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      databaseId
      date
      title
      content
      slug
      excerpt
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
`;
