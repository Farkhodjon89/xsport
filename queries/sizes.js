import gql from 'graphql-tag'

const SIZES = gql`
  query SIZES {
    paSizes(first: 100, where: { hideEmpty: true }) {
      nodes {
        name
        slug
      }
    }
  }
`
export default SIZES
