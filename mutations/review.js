import gql from 'graphql-tag';

export const WRITE_REVIEW = gql`
mutation WriteReview($date: String, $productId: Int!, $userId: Int!, $message: String!, $rating: Int!, $mutationId: String!) {
  writeReview(input: {date: $date, commentOn: $productId, userId: $userId, rating: $rating, content: $message, clientMutationId: $mutationId}) {
    review {
      date
      content
      approved
      author {
        node {
          databaseId
          ... on User {
            firstName
          }
        }
      }
    }
  }
}
`;
