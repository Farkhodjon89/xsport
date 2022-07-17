import gql from 'graphql-tag';

export const ADD_CARD = gql`
mutation AddCard($mutationId: String!, $expire: String!, $number: String!, $token: String!) {
  cardAdd(input: {clientMutationId: $mutationId, expire: $expire, number: $number, token: $token}) {
    id
    expire
    number
  }
}
`;

export const REMOVE_CARD = gql`
mutation AddCard($mutationId: String!, $id: String!) {
  cardRemove(input: {clientMutationId: $mutationId, id: $id}) {
    id
  }
}
`;
