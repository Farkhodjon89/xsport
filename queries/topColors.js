import gql from 'graphql-tag';

const TOPCOLORS = gql`
  query TOPCOLORS($terms: [String]) {
    products(
      first: 100
      where: {
        taxonomyFilter: { and: { taxonomy: PATOPVARIATION, terms: $terms } }
      }
    ) {
      nodes {
        image {
          sourceUrl
        }
        slug
      }
    }
  }
`;
export default TOPCOLORS;
