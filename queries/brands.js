import gql from 'graphql-tag'

const COLORS = gql`
query COLORS($after: String) {
  paBrands(first: 100, where: {hideEmpty: true}, after: $after) {
    nodes {
      name
      slug
    }
  }
}

`
export default COLORS
